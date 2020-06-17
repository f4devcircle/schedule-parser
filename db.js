const Knex = require('knex');
const { PubSub } = require('@google-cloud/pubsub');
const pubSubClient = new PubSub();
const topicName = 'notification';
const connectionObject = {
  'development': {
    client: 'pg',
    connection: {
      host: process.env.DB_DEV_URL,
      user: process.env.DB_DEV_USERNAME,
      password: process.env.DB_DEV_PASSWORD,
      database: process.env.DB_DEV_NAME
    },
    // debug: true
  },
  'production': {
    client: 'pg',
    connection: {
      host: process.env.DB_PROD_URL,
      user: process.env.DB_PROD_USERNAME,
      password: process.env.DB_PROD_PASSWORD,
      database: process.env.DB_PROD_NAME
    }
  }
}

const getConnection = () => {
  const env = process.env.NODE_ENV || 'development';
  return connectionObject[env];
}

const upsert = async (params) => {
  const { table, object, constraint } = params;
  const insert = knex(table).insert(object);
  const update = knex.queryBuilder().update(object);
  const query = await knex.raw(`? ON CONFLICT ${constraint} DO ? returning *`, [insert, update]).get('rows').get(0);
  return query;
};

let knex;
exports.save = async shows => {
  try {
    await connect();
    shows.map(async show => {
      const showEntry = await knex.select().table('shows').where('timestamp', show.unixTime).limit(1);
      console.log(showEntry);
      if (showEntry.length) {
        const showHistory = await knex.select().table('show_histories').where('show_id', showEntry[0].id).orderBy('id', 'desc').limit(1);
        if (JSON.stringify(JSON.parse(showHistory[0].new_members)) !== JSON.stringify(show.showMembers)) {
          const compareResult = compare(JSON.parse(showHistory.length ? showHistory.new_members ? showHistory.new_members : "[]" : "[]"), show.showMembers);
          const showHistoryObj = {
            show_id: showEntry[0].id,
            old_members: showHistory[0].new_members,
            new_members: JSON.stringify(compareResult.newEntry)
          }
          const showDetails = {
            'title': show.title,
            'show_id': showEntry[0].id
          }
          await knex('show_histories').insert(showHistoryObj);
          await notifyUpdate('member', 'delete', compareResult.replacedEntry, showDetails);
          await notifyUpdate('member', 'insert', compareResult.newEntry, showDetails);
        }
      } else {
        let teamName;
        show.team === 'Academy A' ? teamName = 'Academy' : teamName = show.team;
        const setlist = await knex.select('id').table('setlists').where('name', show.title);
        const team = await knex.select('id').table('teams').where('name', teamName);
        const result = await knex('shows').insert({
          setlist_id: setlist[0].id,
          date: show.showDate,
          timestamp: show.unixTime,
          team_id: team[0].id,
          vip: show.order.VIP,
          ofc: show.order.OFC,
          gen: show.order.GENERAL,
          is_event: show.isEvent,
          event_name: show.eventName,
          event_member: show.eventMember,
          ticket_closed: show.order.GENERAL.end
        }).returning('*');
        const showHistory = {
          show_id: result[0].id,
          old_members: JSON.stringify([]),
          new_members: JSON.stringify(show.showMembers || [])
        };
        const showDetails = {
          'title': show.title,
          'show_id': result[0].id
        }
        await knex('show_histories').insert(showHistory);
        await notifyUpdate('setlist', '', [show.showName], showDetails);
      }
    })
    return;
  } catch (e) {
    console.error(e);
  }
}

const compare = (oldData, newData) => {
  const oldValue = oldData || [];
  const newValue = newData;
  let replacedEntry = oldValue.filter(x => !newValue.includes(x));
  let newEntry = (newValue.filter(x => !oldValue.includes(x)));
  return {
    newEntry,
    replacedEntry
  };
}

const notifyUpdate = async (type, action, data, showDetails) => {
  try {
    return await pubSubClient.topic(topicName).publish(Buffer.from(JSON.stringify({
      type,
      action,
      data,
      showDetails
    })));
  } catch (e) {
    console.error(e);
  }
}

const connect = () => {
  return knex ? knex : knex = Knex(getConnection());
}
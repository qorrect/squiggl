const _ = require('lodash');

const compiled = _.template('Hi there ${user.name}');
const out= compiled({user: {name: 'Charlie'}});
console.log(out);
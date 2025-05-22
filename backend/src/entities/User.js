const { EntitySchema } = require('typeorm');

const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    username: {
      type: 'varchar',
      unique: true
    },
    password: {
      type: 'varchar'
    },
    role: {
      type: 'enum',
      enum: ['Employee', 'Manager', 'Admin'],
      default: 'Employee'
    }
  }
});

module.exports = User;
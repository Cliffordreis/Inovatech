const db = require('./db');

const smartphones = db.sequelize.define('smartphones', {
    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    namecell: {
        type: db.Sequelize.STRING,
        allowNull: false,
    },
    specs: {
        type: db.Sequelize.TEXT,
        allowNull: false,
    },
    valor: {
        type: db.Sequelize.FLOAT, // Usar FLOAT para valores monetários pode ser mais apropriado
        allowNull: false,
    }
}, {
    timestamps: false // Desativa os campos createdAt e updatedAt
});

module.exports = smartphones;

// smartphones.sync({force : true});
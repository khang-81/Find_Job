const asyncHandler = require('express-async-handler');
const db = require('../config/db');

const createCrudController = (tableName, pkName) => {
    const getAll = asyncHandler(async (req, res) => {
        const [results] = await db.query(`SELECT * FROM ${tableName}`);
        res.json(results);
    });

    const create = asyncHandler(async (req, res) => {
        const { Name } = req.body;
        if (!Name) {
            res.status(400); throw new Error("Tên là bắt buộc");
        }
        const [result] = await db.query(`INSERT INTO ${tableName} (Name) VALUES (?)`, [Name]);
        res.status(201).json({ id: result.insertId, Name });
    });

    const update = asyncHandler(async (req, res) => {
        const { Name } = req.body;
        await db.query(`UPDATE ${tableName} SET Name = ? WHERE ${pkName} = ?`, [Name, req.params.id]);
        res.json({ message: 'Cập nhật thành công' });
    });

    const remove = asyncHandler(async (req, res) => {
        await db.query(`DELETE FROM ${tableName} WHERE ${pkName} = ?`, [req.params.id]);
        res.json({ message: 'Xóa thành công' });
    });
    
    return { getAll, create, update, remove };
};

exports.categories = createCrudController('JobCategories', 'CategoryId');
exports.locations = createCrudController('Locations', 'LocationId');
exports.skills = createCrudController('Skills', 'SkillId');
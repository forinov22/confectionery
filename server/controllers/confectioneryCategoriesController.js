const pool = require('../config/db');

const getCategories = async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT * FROM confectionery_categories',
            []
        );
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};

const getCategoryById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM confectionery_categories WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

const createCategory = async (req, res, next) => {
    const { name, description } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO confectionery_categories (name, description) VALUES ($1) RETURNING *',
            [name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

const updateCategory = async (req, res, next) => {
    const { name, description } = req.body;
    const { id } = req.params;

    try {
        const result = await pool.query(
            'UPDATE confectionery_categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [name, description, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', data: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

const deleteCategory = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM confectionery_categories WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully', data: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};








// const getCategories = async (req, res, next) => {
//     const { page = 1, limit = 10 } = req.query;

//     const offset = (page - 1) * limit;

//     try {
//         const totalItemsResult = await pool.query(
//             'SELECT COUNT(*) FROM confectionery_categories'
//         );
//         const totalItems = parseInt(totalItemsResult.rows[0].count, 10);

//         const result = await pool.query(
//             `SELECT 
//                 cc.id AS category_id, 
//                 cc.name AS category_name, 
//                 c.image_url AS confectionery_image_url
//             FROM 
//                 confectionery_categories cc
//             LEFT JOIN LATERAL (
//                 SELECT c.image_url 
//                 FROM confectioneries c
//                 JOIN confectionery_categories_assignment cca ON cca.confectionery_id = c.id
//                 WHERE cca.confectionery_category_id = cc.id
//                 LIMIT 1
//             ) c ON true
//             LIMIT $1 OFFSET $2`,
//             [limit, offset]
//         );

//         const totalPages = Math.ceil(totalItems / limit);

//         res.json({
//             data: result.rows,
//             pagination: {
//                 currentPage: parseInt(page, 10),
//                 totalPages,
//                 totalItems,
//                 itemsPerPage: parseInt(limit, 10)
//             }
//         });
//     } catch (err) {
//         next(err);
//     }
// };
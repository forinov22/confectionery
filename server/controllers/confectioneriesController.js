const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

const deleteOldImage = (imageUrl) => {
    if (!imageUrl) return;

    const imagePath = path.join(__dirname, '..', imageUrl);
    fs.unlink(imagePath, (err) => {
        if (err) {
            throw new Exception(`Failed to delete old image at ${imagePath}:`, err);
        } else {
            console.log(`Old image at ${imagePath} deleted successfully.`);
        }
    });
};

const getConfectioneries = async (req, res, next) => {
    const { page = 1, limit = 10, category, search } = req.query;
    const offset = (page - 1) * limit;

    try {
        let totalItemsQuery = 'SELECT COUNT(*) FROM view_confectionery_categories';
        const totalItemsQueryParams = [];

        if (category || search) {
            totalItemsQuery += ' WHERE';
            if (category) {
                totalItemsQuery += ' confectionery_category_name = $1';
                totalItemsQueryParams.push(category);
            }
            if (search) {
                if (category) {
                    totalItemsQuery += ' AND';
                }
                totalItemsQuery += ' confectionery_name ILIKE $' + (totalItemsQueryParams.length + 1);
                totalItemsQueryParams.push(`%${search}%`);
            }
        }

        const totalItemsResult = await pool.query(totalItemsQuery, totalItemsQueryParams);
        const totalItems = parseInt(totalItemsResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);

        let query = 'SELECT * FROM view_confectionery_categories';
        const params = [];

        if (category || search) {
            query += ' WHERE';
            if (category) {
                query += ' confectionery_category_name = $1';
                params.push(category);
            }
            if (search) {
                if (category) {
                    query += ' AND';
                }
                query += ' confectionery_name ILIKE $' + (params.length + 1);
                params.push(`%${search}%`);
            }
        }

        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        res.json({
            data: result.rows,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalItems,
                itemsPerPage: limit
            }
        });
    } catch (err) {
        next(err);
    }
};


const getConfectioneryById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM view_confectionery_categories WHERE confectionery_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Confectionery not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        next(err)
    }
};

const createConfectionery = async (req, res, next) => {
    const { confectionery_name, price } = req.body;
    const image_url = `/uploads/confectioneries/${req.file.filename}`
    try {
        const result = await pool.query(
            'INSERT INTO confectioneries (confectionery_name, price, image_url) VALUES ($1, $2, $3) RETURNING *',
            [confectionery_name, price, image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err)
    }
};

const updateConfectionery = async (req, res, next) => {
    const { confectionery_name, price } = req.body;
    const { id } = req.params;
    let imageUrl = null;

    try {
        const result = await pool.query('SELECT * FROM confectioneries WHERE id = $1', [id]);
        const confectionery = result.rows[0];

        if (!confectionery) {
            return res.status(404).json({ message: 'Confectionery not found' });
        }

        if (req.file) {
            imageUrl = `/uploads/confectioneries/${req.file.filename}`;
            deleteOldImage(confectionery.image_url);
        }

        const updateQuery = `
            UPDATE confectioneries
            SET confectionery_name = $1, price = $2, image_url = COALESCE($3, image_url)
            WHERE id = $4
            RETURNING *;
        `;
        const updatedConfectionery = await pool.query(updateQuery, [confectionery_name, price, imageUrl, id]);

        res.status(200).json({ message: 'Confectionery updated successfully', data: updatedConfectionery.rows[0] });
    } catch (err) {
        next(err)
    }
};

const deleteConfectionery = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deleteQuery = `
            DELETE FROM confectioneries
            WHERE id = $1
            RETURNING *;
        `;
        const deletedConfectionery = await pool.query(deleteQuery, [id])

        res.status(200).json({ message: 'Confectionery deleted successfully', data: deletedConfectionery.rows[0] })
    } catch (err) {
        next(err)
    }
}


module.exports = {
    getConfectioneries,
    getConfectioneryById,
    createConfectionery,
    updateConfectionery,
    deleteConfectionery
};

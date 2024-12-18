const pool = require('../config/db');

const getCartItems = async (req, res, next) => {
    const user_id = req.user.id;

    try {
        const result = await pool.query(`
            SELECT 
            	c.user_id,
            	c.total_items_count,
            	c.total_price,
            	json_agg(json_build_object(
            		'confectionery_id', ci.confectionery_id,
                    'confectionery_name', conf.confectionery_name,
            		'confectionery_quantity', ci.confectionery_quantity,
            		'confectionery_price', conf.price)) AS cart_items
            FROM carts AS c
            LEFT JOIN cart_items AS ci ON c.user_id = ci.cart_id
            LEFT JOIN confectioneries AS conf ON ci.confectionery_id = conf.id
            WHERE c.user_id = $1
            GROUP BY c.user_id;
            `,
            [user_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

const addCartItem = async (req, res, next) => {
    const user_id = req.user.id;
    const { confectionery_id, confectionery_quantity } = req.body;

    try {
        const existingItem = await pool.query(
            'SELECT * FROM cart_items WHERE cart_id = $1 AND confectionery_id = $2',
            [user_id, confectionery_id]
        );

        if (existingItem.rows.length > 0) {
            return res.status(400).json({ message: 'Item already in cart. Please update quantity instead.' });
        }

        const result = await pool.query(
            'INSERT INTO cart_items (cart_id, confectionery_id, confectionery_quantity) VALUES ($1, $2, $3) RETURNING *',
            [user_id, confectionery_id, confectionery_quantity]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

const removeCartItem = async (req, res, next) => {
    const user_id = req.user.id;
    const { id: confectionery_id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM cart_items WHERE cart_id = $1 AND confectionery_id = $2 RETURNING *',
            [user_id, confectionery_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        res.status(200).json({ message: 'Item removed from cart', data: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

const updateCartItemQuantity = async (req, res, next) => {
    const user_id = req.user.id;
    const { id: confectionery_id } = req.params;
    const { confectionery_quantity } = req.body;

    try {
        const result = await pool.query(
            'UPDATE cart_items SET confectionery_quantity = $1 WHERE cart_id = $2 AND confectionery_id = $3 RETURNING *',
            [confectionery_quantity, user_id, confectionery_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        res.status(200).json({ message: 'Cart item quantity updated', data: result.rows[0] });
    } catch (err) {
        next(err);

    }
};

const clearCart = async (req, res, next) => {
    const user_id = req.user.id;

    try {
        const result = await pool.query(
            'DELETE FROM cart_items WHERE cart_id = $1 RETURNING *',
            [user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No items in the cart to clear' });
        }

        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getCartItems,
    addCartItem,
    removeCartItem,
    updateCartItemQuantity,
    clearCart
};

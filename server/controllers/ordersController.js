const pool = require('../config/db');

const getOrders = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM orders');
        res.status(200).json(result.rows);
    } catch (err) {
        next(err)
    }
};

const getUserOrders = async (req, res, next) => {
    const user_id = req.user.id
    try {
        const ordersQuery = `
            SELECT * FROM orders 
            WHERE user_id = $1
        `

        const result = await pool.query(ordersQuery, [user_id])

        res.json(result.rows)
    } catch (err) {
        next(err)
    }
}

const getOrerById = async (req, res, next) => {
    const { id } = req.params
    try {
        const orderQuery = `
            SELECT 
            	o.user_id,
            	o.order_status,
            	o.created_at,
            	o.updated_at,
            	o.total_items_count,
            	o.total_price,
            	json_agg(json_build_object(
            		'confectionery_id', oi.confectionery_id,
            		'confectionery_quantity', oi.confectionery_quantity,
            		'confectionery_price', oi.confectionery_price,
            		'item_total_price', oi.total_price)) AS order_items
            FROM orders AS o
            JOIN order_items AS oi ON oi.order_id = o.id
            WHERE o.id = $1
            GROUP BY o.id;
        `

        const result = await pool.query(orderQuery, [id])

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Order not found' })
        }

        res.json(result.rows[0])
    } catch (err) {
        next(err)
    }
}

const createOrder = async (req, res, next) => {
    const user_id = req.user.id;

    try {
        const createOrderQuery = `
            SELECT * FROM create_order($1)
        `

        await pool.query('BEGIN')

        const result = await pool.query(createOrderQuery, [user_id])

        await pool.query('COMMIT')

        res.json(result.rows[0])
    } catch (err) {
        await pool.query('ROLLBACK')
        next(err)
    }
}

//#region createOrder old
// const createOrder = async (req, res, next) => {
//     //todo: create transaction -> create procedre in database
//     const user_id = req.user.id;

//     try {
//         const cartItemsQuery = `
//             SELECT * FROM cart_items
//             WHERE cart_id = $1
//         `
//         const cartItems = await pool.query(cartItemsQuery, [user_id])

//         const orderQuery = `
//             INSERT INTO orders
//             (user_id, order_status, total_items_count, total_items_price) VALUES
//             ($1, $2, $3, $4)
//             RETURNING *
//         `

//         const orderResult = await pool.query(orderQuery, [user_id, 'Awaiting confirmation', 0, 0])
//         const order = orderResult.rows[0]

//         const confectioneryQuery = `
//             SELECT * FROM confectioneries
//             WHERE id = $1
//         `

//         const orderItemQuery = `
//             INSERT INTO order_items
//             (order_id, confectionery_id, confectionery_quantity, confectionery_price, total_price) VALUES
//             ($1, $2, $3, $4, $5)
//             RETURNING *
//         `

//         const removeCartItemsQuery = `
//             DELTE FROM cart_items
//             WHERE cart_id = $1
//         `

//         for (let i = 0; i < cartItems.rowCount; i++) {
//             const confectioneryResult = await pool.query(confectioneryQuery, [cartItems.rows[i].confectionery_id])

//             if (confectioneryResult.rowCount === 0) {
//                 throw new Exception('Confectionery not found')
//             }

//             const confectionery = confectioneryResult.rows[0]
//             const total_price = cartItems.rows[i].confectionery_quantity * confectionery.price

//             const orderItem = await pool.query(orderItemQuery,
//                 [order.id, confectionery.id, cartItems.rows[i].confectionery_quantity, confectionery.price, total_price])

//             await pool.query(removeCartItemsQuery, [user_id])
//         }

//         res.json(order)

//     } catch (err) {
//         next(err)
//     }
// }

//#endregion

//todo: create order change stauts endpoint

module.exports = {
    getOrders,
    getOrerById,
    getUserOrders,
    createOrder
}
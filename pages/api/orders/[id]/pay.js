import onError from "../../../../utils/error";
import { isAuth } from "../../../../utils/auth";
import { getOrder, updateOrder } from "../../../../utils/db";

/*
async function handlerA(req, res) {
    const id = req.query.id;
    // console.log("id:", id);
    const order = await getOrder(id);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now;
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            email_address: req.body.email_address,
        };
        const paidOrder = await order.save(); //non esiste save() // devo forse fare update in db? questa é PUT request
        // res.status(200).json(order);
        console.log("paidOrder:", paidOrder);
        res.status(200).send({ message: "order paid", order: paidOrder });
    } else {
        res.status(404).send({ message: "order not found" });
    }
} 
*/

async function handler(req, res) {
    const id = req.query.id;
    const order = await getOrder(id);

    if (order) {
        const paymentResult = {
            id: req.body.id,
            status: req.body.status,
            email_address: req.body.email_address,
        };
        const paidOrder = await updateOrder(id, true, paymentResult);
        console.log("paidOrder:", paidOrder);
        res.status(200).send({ message: "order paid", order: paidOrder });
    } else {
        res.status(404).send({ message: "order not found" });
    }
}

export default isAuth(handler); //middleware

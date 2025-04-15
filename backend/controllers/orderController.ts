import { Request, Response } from "express";
import Order from "../models/orderModels";
import Product from "../models/productModels";
import { AuthenticatedRequest } from "../middlewares/authHandler";

// Utility Function
function calcPrices(orderItems:any) {
  const itemsPrice = orderItems.reduce(
    (acc:any, item:any) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const createOrder = async (req:AuthenticatedRequest, res:Response): Promise<void> => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x:any) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient:any) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    if (!req.user) {
        res.status(401).json({ error: "Not authorized" });
        return;
      }

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req:Request, res:Response): Promise<void> => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.json(orders);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req:any, res:Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

const countTotalOrders = async (req:Request, res:Response): Promise<void>=> {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

const calculateTotalSales = async (req:Request, res:Response): Promise<void> => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

const calcualteTotalSalesByDate = async (req:Request, res:Response): Promise<void> => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

const findOrderById = async (req:Request, res:Response): Promise<void>=> {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsPaid = async (req:Request, res:Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsDelivered = async (req:Request, res:Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};

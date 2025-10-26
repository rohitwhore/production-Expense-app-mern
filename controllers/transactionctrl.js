const transactionModel = require('../models/transactionModel');
const moment = require('moment');

const getAllTransaction = async(req, res) => {
    try{
        const {frequency, selectedDate, type} = req.body;
        const transactions = await transactionModel.find({
            ...(frequency !== 'custom' ? {
                date:{
                $gt : moment().subtract(Number(frequency), 'd').toDate(),
            },
            } : {
                date:{
                    $gte: selectedDate[0],
                    $lte: selectedDate[1]
                },
            }),
            userid:req.body.userid,
            ...(type !== 'all' && {type})
        });
        res.status(200).json(transactions);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
        
    }
};

const deleteTransaction = async(req, res) => {
    try{
        await transactionModel.findOneAndDelete({_id: req.body.transactionId});
        res.status(200).send("Transaction Deleted");
    }catch(error){
        console.log(error);
        res.status(500).json(error);
        
    }
}
const editTransaction = async (req, res) => {
    try{
        await transactionModel.findOneAndUpdate(
            { _id: req.body.transactionId},
            req.body.payload
        );
        res.status(200).send("Edit Successfully");
    }catch(error){
        console.log(error);
        res.status(500).json(error);
        
    }
};

const addTransaction = async (req, res) => {
  try {
    const { userid, type, amount, date, category, description, reference } = req.body;

    if (!userid || !type || amount == null || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transactionDate = new Date(date);
    if (isNaN(transactionDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const newTransaction = new transactionModel({
      userid,
      type,
      amount,
      date: transactionDate,
      category: category || "Other",
      description: description || "No description",
      reference: reference || ""
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json({ message: "Transaction Created", transaction: savedTransaction });
  } catch (error) {
    console.error("Add Transaction Error:", error);
    res.status(500).json({ message: error.message });
  }
};




module.exports = { getAllTransaction, addTransaction, editTransaction, deleteTransaction};
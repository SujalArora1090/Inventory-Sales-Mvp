import PDFDocument from "pdfkit";
import Sale from "../models/Sale.js";

export const getSaleInvoice=async(req,res)=>{
      try{
        const sale=await Sale.findById(req.params.id)
        .populate("items.product")
        .populate("customer")
        if(!sale){
            return res.status(404).json("No Sales Found")
        }

        const doc=new PDFDocument()
        res.setHeader("Content-Type","application/pdf")
        res.setHeader("Content-Disposition","inline;filename=invoice.pdf")
        doc.pipe(res)

        doc.fontSize(18).text("invoice",{align:"center"})
        doc.moveDown()
        doc.fontSize(12).text(`Customer:${sale.customer?.name}`)
        doc.text(`Date:${new Date(sale.createdAt).toLocaleDateString()}`)
        doc.moveDown()

        sale.items.forEach((i) => {
            doc.text(`${i.product.name}*${i.quantity}`)
        });
        doc.moveDown()
        doc.text(`total:${sale.total}`,{align:"right"})
        doc.end()
      }catch(err){
        res.status(500).json({message:"Error Generating Invoice"})
      }
}
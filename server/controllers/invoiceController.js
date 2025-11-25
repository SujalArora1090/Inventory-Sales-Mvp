import PDFDocument from "pdfkit";
import Sale from "../models/Sale.js";

export const getSaleInvoice = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("items.product", "name price")
      .populate("customer", "name email");

    if (!sale) {
      return res.status(404).json({ message: "No Sale Found" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=invoice.pdf");

    doc.pipe(res);

  
    

    
    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();

  
    doc.fontSize(12).text(`Customer: ${sale.customer?.name || "N/A"}`);
    if (sale.customer?.email) doc.text(`Email: ${sale.customer.email}`);
    doc.text(`Date: ${new Date(sale.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    
    doc.fontSize(14).text("Items Purchased:", { underline: true });
    doc.moveDown(0.5);

    if (sale.items && sale.items.length > 0) {
      sale.items.forEach((i) => {
        doc.text(
          `${i.product?.name || "Item"} — ${i.quantity} x ₹${i.priceAtSale} = ₹${i.quantity * i.priceAtSale}`
        );
      });
    }
    doc.moveDown();

    
    doc.fontSize(12).text(`Subtotal: ₹${sale.total}`, { align: "right" });

    if (sale.gst) {
      doc.text(`GST: ₹${sale.gst}`, { align: "right" });
    }

    if (sale.discount) {
      doc.text(`Discount: -₹${sale.discount}`, { align: "right" });
    }

    doc.moveDown();

    
    const finalTotal = (sale.total || 0) + (sale.gst || 0) - (sale.discount || 0);

    doc.fontSize(14)
      .text(`Final Total: ₹${finalTotal}`, {
        align: "right",
        underline: true,
      });

    doc.end();

  } catch (err) {
    console.error("Invoice Error:", err);
    res.status(500).json({ message: "Error Generating Invoice" });
  }
};

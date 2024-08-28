import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './InvoiceGenerator.css';

const InvoiceGenerator = () => {
    const invoiceRef = useRef(null);
    const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
    const [invoiceDate] = useState(new Date().toLocaleDateString());

    const handleDownload = () => {
        const input = invoiceRef.current;
        html2canvas(input, {
            scale: 4, // Increase scale for higher resolution
            useCORS: true,
            logging: true,
            allowTaint: false,
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
    
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
            let heightLeft = imgHeight;
            let position = 0;
            const xOffset = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
    
            pdf.addImage(imgData, 'PNG', xOffset, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
    
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', xOffset, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
    
            pdf.save('invoice.pdf');
        });
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, price: 0 }]);
    };

    const deleteItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleChange = (index, event) => {
        const { name, value } = event.target;
        const newItems = [...items];
        newItems[index][name] = value;
        setItems(newItems);
    };

    return (
        <div className="invoice-container" ref={invoiceRef}>
            <div className="invoice-header">
                <div>
                    <label>Invoice Number:</label>
                    <input type="text" placeholder="Enter Invoice Number" />
                </div>
                <div>
                    <label>Invoice Date:</label>
                    <input type="text" value={invoiceDate} readOnly />
                </div>
            </div>

            <div className="invoice-info">
                <div>
                    <label>Bill To:</label>
                    <textarea placeholder="Enter billing address"></textarea>
                </div>
                <div>
                    <label>Ship To:</label>
                    <textarea placeholder="Enter shipping address"></textarea>
                </div>
            </div>

            <table className="invoice-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    name="description"
                                    value={item.description}
                                    onChange={(event) => handleChange(index, event)}
                                    placeholder="Item description"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={item.quantity}
                                    onChange={(event) => handleChange(index, event)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="price"
                                    value={item.price}
                                    onChange={(event) => handleChange(index, event)}
                                />
                            </td>
                            <td>{(item.quantity * item.price).toFixed(2)}</td>
                            <td>
                                <button className="delete-btn" onClick={() => deleteItem(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="add-item" onClick={addItem}>Add Item</button>

            <div className="invoice-notes">
                <label>Notes:</label>
                <textarea placeholder="Additional notes"></textarea>
            </div>

            <button className="download-btn" onClick={handleDownload}>Download PDF</button>
        </div>
    );
};

export default InvoiceGenerator;

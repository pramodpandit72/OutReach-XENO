import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, UserPlus, ShoppingBag, Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { createCustomersBulk, createOrdersBulk, getCustomers, createCustomer, createOrder } from '../services/api';

export default function Ingest() {
  const [activeTab, setActiveTab] = useState('bulk'); // 'bulk' | 'manual'
  const [manualType, setManualType] = useState('customer'); // 'customer' | 'order'
  
  // Bulk states
  const [csvType, setCsvType] = useState('customers'); // 'customers' | 'orders'
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [importing, setImporting] = useState(false);
  
  // Manual states
  const [customersList, setCustomersList] = useState([]);
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', phone: '', city: '', gender: 'Other', age: '' });
  const [orderForm, setOrderForm] = useState({ customerId: '', amount: '', channel: 'Online', status: 'Delivered' });
  const [submittingManual, setSubmittingManual] = useState(false);

  // Load customers list for Manual Order dropdown
  const loadCustomers = async () => {
    try {
      const { data } = await getCustomers({ limit: 100 });
      setCustomersList(data.customers || []);
      if (data.customers?.length > 0) {
        setOrderForm(f => ({ ...f, customerId: data.customers[0]._id }));
      }
    } catch (e) {
      console.error('Failed to load customers for selector', e);
    }
  };

  useEffect(() => {
    if (activeTab === 'manual') {
      loadCustomers();
    }
  }, [activeTab]);

  const downloadTemplate = (type) => {
    let headers = '';
    let data = '';
    let filename = '';
    if (type === 'customers') {
      headers = 'name,email,phone,city,gender,age\n';
      data = 'Raj Malhotra,raj@example.com,9876543210,Mumbai,Male,28\nPriya Singh,priya@example.com,9876543211,Delhi,Female,24\nAnkit Sharma,ankit@example.com,9876543212,Pune,Male,32\n';
      filename = 'customers_template.csv';
    } else {
      headers = 'customerEmail,amount,channel,status\n';
      data = 'raj@example.com,1500,Online,Delivered\npriya@example.com,2400,In-Store,Delivered\nankit@example.com,850,App,Delivered\n';
      filename = 'orders_template.csv';
    }
    
    const blob = new Blob([headers + data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${filename} downloaded`);
  };

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    
    const results = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const row = [];
      let insideQuote = false;
      let entries = [];
      let currentEntry = '';
      for (let charIdx = 0; charIdx < line.length; charIdx++) {
        const char = line[charIdx];
        if (char === '"') {
          insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
          entries.push(currentEntry.trim());
          currentEntry = '';
        } else {
          currentEntry += char;
        }
      }
      entries.push(currentEntry.trim());
      
      const obj = {};
      headers.forEach((header, index) => {
        let val = entries[index] || '';
        val = val.replace(/^["']|["']$/g, '');
        obj[header] = val;
      });
      results.push(obj);
    }
    return results;
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      return toast.error('Please upload a valid CSV file');
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const data = parseCSV(text);
      if (data.length === 0) {
        toast.error('The CSV file appears to be empty or has no data rows');
        return;
      }
      setParsedData(data);
      toast.success(`Parsed ${data.length} rows from file`);
    };
    reader.readAsText(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragOver(true);
    } else if (e.type === 'dragleave') {
      setDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;
    setImporting(true);
    try {
      if (csvType === 'customers') {
        const { data } = await createCustomersBulk({ customers: parsedData });
        toast.success(data.message || 'Customers imported successfully!');
      } else {
        const { data } = await createOrdersBulk({ orders: parsedData });
        toast.success(data.message || 'Orders imported successfully!');
      }
      setSelectedFile(null);
      setParsedData([]);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Import failed. Check CSV formatting.');
    } finally {
      setImporting(false);
    }
  };

  const submitCustomer = async (e) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.email) {
      return toast.error('Name and Email are required');
    }
    setSubmittingManual(true);
    try {
      await createCustomer({
        ...customerForm,
        age: customerForm.age ? Number(customerForm.age) : undefined
      });
      toast.success('Customer created successfully! 🎉');
      setCustomerForm({ name: '', email: '', phone: '', city: '', gender: 'Other', age: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create customer');
    } finally {
      setSubmittingManual(false);
    }
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    if (!orderForm.customerId || !orderForm.amount) {
      return toast.error('Customer and Amount are required');
    }
    setSubmittingManual(true);
    try {
      await createOrder({
        ...orderForm,
        amount: Number(orderForm.amount)
      });
      toast.success('Order created successfully! 💰');
      setOrderForm(f => ({ ...f, amount: '' }));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create order');
    } finally {
      setSubmittingManual(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Ingest Data</h1>
        <p className="page-subtitle">Add customers and sales data using CSV or forms</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[var(--color-border)]">
        <button
          onClick={() => setActiveTab('bulk')}
          className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === 'bulk' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
          id="ingest-tab-bulk"
        >
          Bulk CSV Import
          {activeTab === 'bulk' && <motion.div layoutId="activeIngestTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === 'manual' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
          id="ingest-tab-manual"
        >
          Manual Data Intake
          {activeTab === 'manual' && <motion.div layoutId="activeIngestTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'bulk' ? (
          <motion.div
            key="bulk-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Control panel */}
            <div className="card space-y-6 lg:col-span-1">
              <div>
                <h3 className="section-title">1. Selection</h3>
                <p className="text-xs text-gray-500 mt-1">Select the type of data to import</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-all">
                  <input
                    type="radio"
                    name="csvType"
                    checked={csvType === 'customers'}
                    onChange={() => { setCsvType('customers'); setSelectedFile(null); setParsedData([]); }}
                    className="text-cyan-500 focus:ring-cyan-500"
                    id="csv-type-customers"
                  />
                  <div>
                    <p className="text-sm font-semibold">Customers List</p>
                    <p className="text-xs text-gray-500">Import profiles, locations, ages, etc.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-all">
                  <input
                    type="radio"
                    name="csvType"
                    checked={csvType === 'orders'}
                    onChange={() => { setCsvType('orders'); setSelectedFile(null); setParsedData([]); }}
                    className="text-cyan-500 focus:ring-cyan-500"
                    id="csv-type-orders"
                  />
                  <div>
                    <p className="text-sm font-semibold">Order History</p>
                    <p className="text-xs text-gray-500">Import values, status, items by email</p>
                  </div>
                </label>
              </div>

              <div className="divider"></div>

              <div>
                <h3 className="section-title">2. Download Template</h3>
                <p className="text-xs text-gray-500 mt-1">Download standard CSV template for validation</p>
                <button
                  onClick={() => downloadTemplate(csvType)}
                  className="btn btn-ghost btn-sm w-full mt-3 flex items-center justify-center gap-2"
                  id="download-template-btn"
                >
                  <Download size={14} /> Download Template
                </button>
              </div>
            </div>

            {/* Drag & Drop Area */}
            <div className="lg:col-span-2 space-y-4">
              <div
                className={`drop-zone ${dragOver ? 'drag-over' : ''} h-80 flex flex-col items-center justify-center`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('csv-file-input').click()}
              >
                <input
                  type="file"
                  id="csv-file-input"
                  className="hidden"
                  accept=".csv"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                
                <div className="p-4 rounded-full bg-cyan-500/10 text-cyan-400 mb-4 animate-bounce">
                  <Upload size={32} />
                </div>
                <h3 className="font-semibold text-base mb-1">Drag and drop your CSV file here</h3>
                <p className="text-xs text-gray-500 mb-3">or click to browse from files</p>
                <p className="text-[11px] text-gray-600">Only .csv files are supported. Must match template headers.</p>
              </div>

              {selectedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card flex items-center justify-between p-4"
                  style={{ background: 'rgba(34,211,238,0.08)', borderColor: 'rgba(34,211,238,0.2)' }}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-cyan-400" />
                    <div>
                      <p className="text-sm font-semibold">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB · {parsedData.length} records parsed</p>
                    </div>
                  </div>
                  <button
                    onClick={handleImport}
                    disabled={importing}
                    className="btn btn-primary btn-sm"
                    id="import-csv-submit-btn"
                  >
                    {importing ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Import'}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="manual-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Form selection */}
            <div className="card space-y-4 lg:col-span-1">
              <div>
                <h3 className="section-title">Manual Creation</h3>
                <p className="text-xs text-gray-500 mt-1">Input individual records directly into the database</p>
              </div>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setManualType('customer')}
                  className={`btn ${manualType === 'customer' ? 'btn-primary' : 'btn-ghost'} justify-start`}
                  id="select-manual-customer"
                >
                  <UserPlus size={16} /> Add Individual Customer
                </button>
                <button
                  onClick={() => setManualType('order')}
                  className={`btn ${manualType === 'order' ? 'btn-primary' : 'btn-ghost'} justify-start`}
                  id="select-manual-order"
                >
                  <ShoppingBag size={16} /> Add Customer Order
                </button>
              </div>
            </div>

            {/* Form Area */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {manualType === 'customer' ? (
                  <motion.div
                    key="customer-form"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="card"
                  >
                    <h3 className="section-title mb-4">New Customer Profile</h3>
                    <form onSubmit={submitCustomer} className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Full Name *</label>
                        <input
                          className="input"
                          placeholder="e.g. Raj Malhotra"
                          value={customerForm.name}
                          onChange={e => setCustomerForm(f => ({ ...f, name: e.target.value }))}
                          required
                          id="manual-cust-name"
                        />
                      </div>
                      
                      <div>
                        <label className="label">Email Address *</label>
                        <input
                          className="input"
                          type="email"
                          placeholder="e.g. raj@example.com"
                          value={customerForm.email}
                          onChange={e => setCustomerForm(f => ({ ...f, email: e.target.value }))}
                          required
                          id="manual-cust-email"
                        />
                      </div>
                      
                      <div>
                        <label className="label">Phone Number</label>
                        <input
                          className="input"
                          placeholder="e.g. 9876543210"
                          value={customerForm.phone}
                          onChange={e => setCustomerForm(f => ({ ...f, phone: e.target.value }))}
                          id="manual-cust-phone"
                        />
                      </div>

                      <div>
                        <label className="label">City</label>
                        <input
                          className="input"
                          placeholder="e.g. Mumbai"
                          value={customerForm.city}
                          onChange={e => setCustomerForm(f => ({ ...f, city: e.target.value }))}
                          id="manual-cust-city"
                        />
                      </div>

                      <div>
                        <label className="label">Gender</label>
                        <select
                          className="select"
                          value={customerForm.gender}
                          onChange={e => setCustomerForm(f => ({ ...f, gender: e.target.value }))}
                          id="manual-cust-gender"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="label">Age</label>
                        <input
                          className="input"
                          type="number"
                          placeholder="e.g. 28"
                          value={customerForm.age}
                          onChange={e => setCustomerForm(f => ({ ...f, age: e.target.value }))}
                          id="manual-cust-age"
                        />
                      </div>

                      <div className="md:col-span-2 pt-2">
                        <button
                          type="submit"
                          disabled={submittingManual}
                          className="btn btn-primary w-full"
                          id="manual-cust-submit"
                        >
                          {submittingManual ? <Loader2 size={16} className="animate-spin" /> : 'Create Customer Profile'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="order-form"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="card"
                  >
                    <h3 className="section-title mb-4">Record Sale Order</h3>
                    {customersList.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <AlertCircle className="mx-auto mb-2 text-yellow-500" size={24} />
                        <p className="text-sm">No customers available. Please add a customer first.</p>
                      </div>
                    ) : (
                      <form onSubmit={submitOrder} className="space-y-4">
                        <div>
                          <label className="label">Customer *</label>
                          <select
                            className="select"
                            value={orderForm.customerId}
                            onChange={e => setOrderForm(f => ({ ...f, customerId: e.target.value }))}
                            required
                            id="manual-order-cust-select"
                          >
                            {customersList.map(c => (
                              <option key={c._id} value={c._id}>
                                {c.name} ({c.email})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="label">Amount (₹) *</label>
                            <input
                              className="input"
                              type="number"
                              placeholder="e.g. 1500"
                              value={orderForm.amount}
                              onChange={e => setOrderForm(f => ({ ...f, amount: e.target.value }))}
                              required
                              id="manual-order-amount"
                            />
                          </div>

                          <div>
                            <label className="label">Sales Channel</label>
                            <select
                              className="select"
                              value={orderForm.channel}
                              onChange={e => setOrderForm(f => ({ ...f, channel: e.target.value }))}
                              id="manual-order-channel"
                            >
                              <option value="Online">Online</option>
                              <option value="In-Store">In-Store</option>
                              <option value="App">App</option>
                            </select>
                          </div>

                          <div>
                            <label className="label">Status</label>
                            <select
                              className="select"
                              value={orderForm.status}
                              onChange={e => setOrderForm(f => ({ ...f, status: e.target.value }))}
                              id="manual-order-status"
                            >
                              <option value="Delivered">Delivered</option>
                              <option value="Pending">Pending</option>
                              <option value="Returned">Returned</option>
                            </select>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={submittingManual}
                            className="btn btn-primary w-full"
                            id="manual-order-submit"
                          >
                            {submittingManual ? <Loader2 size={16} className="animate-spin" /> : 'Record Order'}
                          </button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

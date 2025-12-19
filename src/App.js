import React, { useState } from 'react';
import { Send, Upload, X, Eye } from 'lucide-react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    recipientEmail: '',
    orderNumber: '',
    firstName: '',
    lastName: '',
    senderName: 'Ashe Sule',
    senderEmail: 'info@ashesule.com',
    senderDomain: 'ashesule.com',
    customMessage: 'Thank you for your purchase! Your order has been packaged and is ready for shipment. We take great pride in our work and we know that you are eagerly awaiting the arrival of your packaged. Now that your order is approaching completion, we have taken a few photos of your package and we would like to share them with you. Below are photos of your system.'
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);

  files.forEach((file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const base64String = event.target.result.split(',')[1]; // ✅ STRIP data:image prefix

      setImages((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          content: base64String,     // ✅ SEND TO BACKEND
          type: file.type,           // ✅ image/png
          filename: file.name,       // ✅ product.png
          preview: event.target.result // 👁️ KEEP for UI preview
        }
      ]);
    };

    reader.readAsDataURL(file);
  });
};


  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSendEmail = async () => {
    if (!formData.recipientEmail || !formData.orderNumber || !formData.firstName) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const imageData = images.map(img => img.src);

      // Use environment variable for backend URL
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

      const response = await fetch(`${backendUrl}/api/send-order-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: formData.recipientEmail,
          recipientName: `${formData.firstName} ${formData.lastName}`,
          orderNumber: formData.orderNumber,
          firstName: formData.firstName,
          lastName: formData.lastName,
          senderName: formData.senderName,
          senderEmail: formData.senderEmail,
          senderDomain: formData.senderDomain,
          customMessage: formData.customMessage,
          images: imageData
        })
      });

      if (response.ok) {
        setSuccessMessage(`✓ Order confirmation sent to ${formData.recipientEmail}`);
        setTimeout(() => setSuccessMessage(''), 5000);
        setFormData(prev => ({ ...prev, recipientEmail: '', orderNumber: '', firstName: '', lastName: '' }));
        setImages([]);
      } else {
        alert('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending email: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Order Confirmation Email System</h1>
            <p className="text-blue-100 mt-2">Send professional order confirmation emails with product photos</p>
          </div>

          <div className="p-8">
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                {successMessage}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-lg border border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">Recipient Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Recipient Email *</label>
                      <input
                        type="email"
                        name="recipientEmail"
                        value={formData.recipientEmail}
                        onChange={handleInputChange}
                        placeholder="customer@example.com"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Sales Order Number *</label>
                      <input
                        type="text"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={handleInputChange}
                        placeholder="#278752"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-lg border border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">Sender Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Sender Name</label>
                      <input
                        type="text"
                        name="senderName"
                        value={formData.senderName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Sender Email (Company Domain)</label>
                      <input
                        type="email"
                        name="senderEmail"
                        value={formData.senderEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Company Domain</label>
                      <input
                        type="text"
                        name="senderDomain"
                        value={formData.senderDomain}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-lg border border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">Custom Message</h2>
                  <textarea
                    name="customMessage"
                    value={formData.customMessage}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sm"
                  />
                </div>

                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-lg border border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">Product Photos</h2>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="file-input"
                    />
                    <label htmlFor="file-input" className="cursor-pointer">
                      <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                      <p className="text-sm font-medium text-slate-700">Click to upload photos</p>
                      <p className="text-xs text-slate-500">or drag and drop</p>
                    </label>
                  </div>

                  {images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-700 mb-3">{images.length} photo(s) selected</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {images.map(img => (
                          <div key={img.id} className="relative group">
                            <img src={img.src} alt="product" className="w-full h-24 object-cover rounded-lg" />
                            <button
                              onClick={() => removeImage(img.id)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setPreview(!preview)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium"
                  >
                    <Eye className="h-5 w-5" />
                    {preview ? 'Hide Preview' : 'Preview Email'}
                  </button>
                  <button
                    onClick={handleSendEmail}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition font-medium"
                  >
                    <Send className="h-5 w-5" />
                    {loading ? 'Sending...' : 'Send Email'}
                  </button>
                </div>
              </div>

              {/* Preview Section */}
              {preview && (
                <div className="lg:col-span-1">
                  <div className="bg-white border-2 border-blue-200 rounded-lg overflow-hidden sticky top-6">
                    <div className="bg-blue-600 px-4 py-3">
                      <p className="text-white text-sm font-semibold">Email Preview</p>
                    </div>
                    <div className="p-4 max-h-96 overflow-y-auto">
                      <div className="text-xs text-slate-600 mb-3 pb-3 border-b">
                        <p><span className="font-semibold">From:</span> {formData.senderName} &lt;{formData.senderEmail}&gt;</p>
                        <p><span className="font-semibold">To:</span> {formData.recipientEmail}</p>
                        <p><span className="font-semibold">Subject:</span> Your Order #{formData.orderNumber} is Ready</p>
                      </div>
                      <div className="text-sm text-slate-700 space-y-2">
                        <div className="bg-slate-100 p-3 rounded text-center mb-3">
                          <p className="font-bold text-blue-600">Order #{formData.orderNumber}</p>
                        </div>
                        <p>Hi {formData.firstName},</p>
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{formData.customMessage}</p>
                        {images.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold mb-2">[{images.length} product photos]</p>
                            <div className="space-y-1">
                              {images.map(img => (
                                <div key={img.id} className="text-xs text-slate-500">[Photo attached]</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

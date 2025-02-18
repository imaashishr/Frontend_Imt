import React, { useState, useEffect } from 'react';
import AsnCard from './AsnCard';
import Sidebar from '../../template/Sidebar';
import '../../custom css/VendorCard.css';

const AsnPage = ({ user }) => {
    const [asns, setAsns] = useState([]);
    console.log("basvgdsvnas", asns);
    

    // Fetch ASN data from the backend
    useEffect(() => {
        const fetchAsns = async () => {
            try {
                const id = user?.id; // Ensure user ID is available
                const response = await fetch(`http://localhost:4000/api/asn/${id}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                if (Array.isArray(data)) {
                    setAsns(data);
                } else {
                    console.error("Invalid API response format:", data);
                    setAsns([]);
                }
            } catch (error) {
                console.error('Error fetching ASNs:', error);
                setAsns([]);
            }
        };

        fetchAsns();
    }, [user?.id]); // Add user.id as a dependency

    const handleDeleteAsn = async (id) => {
        try {
            await fetch(`http://localhost:4000/api/asn/${id}`, { method: 'DELETE' });
            setAsns(asns.filter(asn => asn.id !== id));
        } catch (error) {
            console.error('Error deleting ASN:', error);
        }
    };

    const handleCardClick = (asn) => {
        console.log("Card clicked:", asn);
    };

    return (
        <div className="flex">
            <Sidebar user={user} />
            <div className="flex-1 p-8 bg-gray-50 min-h-screen">
                <h1 className="text-4xl font-bold text-center text-[#3B71CA] mb-8">
                    Advance Shipping Notices
                </h1>
                <div className="flex flex-wrap justify-center gap-6">
                    {asns.map((asn) => (
                        <AsnCard
                            key={asn.id}
                            asn={asn}
                            onClick={() => handleCardClick(asn)}
                            onDelete={() => handleDeleteAsn(asn.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AsnPage;
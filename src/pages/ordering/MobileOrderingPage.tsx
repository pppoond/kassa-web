import React, { useState } from 'react';
import { useMenu } from '../../hooks/useMenu';
import MenuItemCard from '../../components/ordering/MenuItemCard';
import CartDrawer from '../../components/ordering/CartDrawer';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../store/useCartStore';

const MobileOrderingPage: React.FC = () => {
    // const { orderId } = useParams<{ orderId: string }>(); // Unused for now
    const { data: categories = [], isLoading: loading } = useMenu();
    const { t } = useTranslation();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { clearCart } = useCartStore();

    // useEffect(() => {
    //     fetchMenu();
    // }, []);

    const handlePlaceOrder = () => {
        // Mock API call
        alert(t('cart.orderPlaced'));
        clearCart();
        setIsCartOpen(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="pb-24">
            {/* Categories and Items */}
            {categories.map((category) => (
                <div key={category.categoryId} id={`category-${category.categoryId}`} className="mb-8 scroll-mt-20">
                    <h2 className="text-xl font-bold mb-4 sticky top-16 bg-base-100/95 backdrop-blur z-30 py-2 px-2 -mx-2">
                        {category.categoryName}
                    </h2>
                    <div className="flex flex-col gap-0">
                        {category.items.map((item) => (
                            <MenuItemCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            ))}

            {/* Cart Drawer */}
            <CartDrawer 
                isOpen={isCartOpen} 
                onToggle={() => setIsCartOpen(!isCartOpen)} 
                onPlaceOrder={handlePlaceOrder}
            />
        </div>
    );
};

export default MobileOrderingPage;

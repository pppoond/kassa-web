import React from 'react';
import { useMenu } from '../../hooks/useMenu';

export const MenuList: React.FC = () => {
  const { data: categories, isLoading, error } = useMenu();

  if (isLoading) {
    return <div className="p-4 text-center">Loading menu...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error loading menu: {error.message}</div>;
  }

  if (!categories || categories.length === 0) {
    return <div className="p-4 text-center">No menu items found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Menu</h1>
      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category.categoryId} className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-3 text-primary">{category.categoryName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((item) => (
                <div key={item.id} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                   {item.imageUrl && (
                    <figure>
                      <img src={item.imageUrl} alt={item.name} className="h-48 w-full object-cover" />
                    </figure>
                   )}
                  <div className="card-body">
                    <h3 className="card-title justify-between">
                      {item.name}
                      <span className="badge badge-secondary">${item.price.toFixed(2)}</span>
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                    <div className="card-actions justify-end mt-2">
                       <button className="btn btn-primary btn-sm">Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

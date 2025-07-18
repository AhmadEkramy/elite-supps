import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { db } from '@/lib/utils';
import { collection, getDocs } from 'firebase/firestore';

const MenuPage = () => {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDocs(collection(db, 'products')).then(snapshot => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <h1 className="text-4xl font-bold mb-10 text-elite-primary text-center">
          {t('menu')}
        </h1>
        {loading ? (
          <div className="text-center text-gray-400 py-12 text-lg">Loading products...</div>
        ) : (
          categories.map(category => {
            const catProducts = products.filter(p => p.category === category.id);
            if (catProducts.length === 0) return null;
            return (
              <section key={category.id} className="mb-16">
                <div className="flex items-center mb-6 gap-4">
                  <img src={category.image} alt={language === 'ar' ? category.nameAr : category.name} className="w-12 h-12 object-contain" />
                  <h2 className="text-2xl font-bold bg-gradient-elite bg-clip-text text-transparent">
                    {language === 'ar' ? category.nameAr : category.name}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                  {catProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MenuPage; 
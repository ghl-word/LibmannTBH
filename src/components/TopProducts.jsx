import './TopProducts.css'

export default function TopProducts() {
  const products = [
    { name: 'Película 3D iPhone', quantity: 240 },
    { name: 'Cabo Lightning Original', quantity: 180 },
    { name: 'Carregador Rápido 20W', quantity: 150 },
    { name: 'Capa Silicone (Variadas)', quantity: 110 },
  ]

  const maxQuantity = 240

  return (
    <div className="top-products">
      <h3 className="top-products-title">Mais Vendidos (Unidades)</h3>
      <div className="products-list">
        {products.map((product, index) => (
          <div key={index} className="product-item">
            <div className="product-info">
              <p className="product-name">{product.name}</p>
              <p className="product-quantity">{product.quantity}</p>
            </div>
            <div className="product-bar-container">
              <div 
                className="product-bar"
                style={{
                  width: `${(product.quantity / maxQuantity) * 100}%`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

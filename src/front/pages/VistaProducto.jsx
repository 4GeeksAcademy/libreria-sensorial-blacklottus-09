import useGlobalReducer from "../hooks/useGlobalReducer"
import { useParams } from "react-router-dom"
import { getProduct } from "../services/products"
import { useEffect, useState } from "react"


export const VistaProducto = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    const fetchProduct = async () => {
        const product_fetch = await getProduct(id)
        if (product_fetch) {
            setProduct(product_fetch)
        }
    }
    useEffect(() => {
        fetchProduct()
    }, [])
    console.log(product)

    return (
        <div className="container my-5">
            <div className="mobile d-md-none">
                <div className="row">
                    <div className="text-center font-title col-12">
                        <h2>soy un producto xd</h2>
                    </div>
                    <div id="carouselExampleIndicators" class="carousel slide ">
                        <div class="carousel-indicators">
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>

                        </div>
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <img src="https://picsum.photos/200" class="d-block w-100" alt="..." />
                            </div>
                            <div class="carousel-item">
                                <img src="https://picsum.photos/200" class="d-block w-100" alt="..." />
                            </div>
                            <div class="carousel-item">
                                <img src="https://picsum.photos/200" class="d-block w-100" alt="..." />
                            </div>
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                    <div >
                        <div>
                            <select class="form-select" aria-label="Default select example">
                                <option selected>Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </div>
                        <div className="precio">
                            <p> 100 dolarucos</p>
                            <p>soy la descripcion</p>

                        </div>
                        <div className="cart buttons input-group mb-3">
                            <button class="btn btn-primary" type="submit">Button</button>
                            <button class="btn btn-primary" type="submit">Button</button>
                            <input className="form-control" placeholder="2" />
                            <button class="btn btn-primary" type="submit">Button</button>

                        </div>
                    </div>
                </div>
            </div>
            <div className="big-screen d-md-block d-none">
                <div className="row ">
                    <div className="col-1">
                        <div className="border border-dark mb-2">
                            <img src="https://picsum.photos/801" className="img-fluid p-1 " />
                        </div>
                        <div className="border border-dark mb-2">
                            <img src="https://picsum.photos/802" className="img-fluid p-1 " />
                        </div>
                        <div className="border border-dark mb-2">
                            <img src="https://picsum.photos/700" className="img-fluid p-1 " />
                        </div>
                    </div>
                    <div className="col-6">
                        <img src="https://picsum.photos/800" className="img-fluid" />

                    </div>
                    <div className="col-5">
                        <p className="fs-4 text">soy un producto</p>
                        <p className="fs-4 text">104 robucos</p>
                        <p>descripcion</p>
                        <div>
                            <select class="form-select" aria-label="Default select example">
                                <option selected>Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                            <div className="cart buttons input-group mb-3 row">
                                <div className="col-6">
                                    <button class="btn terracota" type="submit">Añadir al carrito</button>
                                </div>
                                <div className="input-group" style={{ width: '130px' }}>
                                    <label className="form-label me-3 mb-0">Cantidad:</label>
                                    <button className="btn btn-outline-secondary" type="button" onClick={() => handleQuantityChange(-1)}>-</button>
                                    <input type="text" className="form-control text-center" />
                                    <button className="btn btn-outline-secondary" type="button" onClick={() => handleQuantityChange(1)}>+</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

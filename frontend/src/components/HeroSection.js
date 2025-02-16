import { Link } from "react-router-dom"; // Import Link
import CustomImage from "./CustomImage";

export default function HeroSection() {
    const images = [
        "/img/gallery/img_1.jpg",
        "/img/gallery/img_2.jpg",
        "/img/gallery/img_3.jpg",
        "/img/gallery/img_4.jpg",
        "/img/gallery/img_5.jpg",
        "/img/gallery/img_6.jpg",
        "/img/gallery/img_7.jpg",
        "/img/gallery/img_8.jpg",
        "/img/gallery/img_9.jpg"
    ];

    return (
        <div className="section hero">
            <div className="col typography">
                <h1 className="title">What are we about?</h1>
                <p className="info">
                    This is a place where one can find all kinds of recipes.
                </p>
                {/* Wrap the button with Link to make it navigate */}
                <Link to="/cuisines">
                    <button className="btn">Explore now</button>
                </Link>
            </div>
            <div className="col gallery">
                {images.map((src, index) => (
                    <CustomImage key={index} imgSrc={src} pt={"90%"} />
                ))}
            </div>
        </div>
    );
}

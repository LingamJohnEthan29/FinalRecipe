import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons"

export default function QuoteSection(){
    return(
        <div className="section quote">
            <p className="quote-text"><FontAwesomeIcon icon={faQuoteLeft}/>Food is art, and food is love. And we should show love and appreciation for those who cook it by eating it with relish.  <FontAwesomeIcon icon={faQuoteRight}/> </p>
            <p className="quote-author"> ~ Mark Bittman </p>
        </div>
    )
}
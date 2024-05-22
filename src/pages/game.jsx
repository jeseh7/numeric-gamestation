import { signOut } from "firebase/auth"; 
import { auth } from "../firebase";

export const Game = () => {
    const handleSignOut = () => {
        signOut(auth)
        .then(() => console.log("Sign Out"))
        .catch((error) => console.log(error));
    };
    return ( 
        <section>
            <h2>
                GAME
            </h2>
            <button onClick={handleSignOut}>Sign Out</button>
        </section>
    )
}
export default Game;
import Rect from "../Geom/Rect";

interface ITappable {
    enabled: boolean;
    getBounds(): Rect;
}

export default ITappable;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
const socket_1 = require("./socket");
const chat_route_1 = __importDefault(require("./routes/chat.route"));
const db_1 = __importDefault(require("./config/db"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const profile_route_1 = __importDefault(require("./routes/profile.route"));
const request_route_1 = __importDefault(require("./routes/request.route"));
const feed_route_1 = __importDefault(require("./routes/feed.route"));
const helmet_1 = __importDefault(require("helmet"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const search_route_1 = __importDefault(require("./routes/search.route"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
});
(0, socket_1.initializeSocket)(io);
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Middleware to attach Socket.IO instance to the request object
app.use((req, res, next) => {
    req.io = io;
    next();
});
app.get("/", (req, res) => {
    res.send("hello from server");
});
app.use("/auth", auth_route_1.default);
app.use("/profile", profile_route_1.default);
app.use("/request", request_route_1.default);
app.use("/feed", feed_route_1.default);
app.use("/chat", chat_route_1.default);
app.use("/payment", payment_route_1.default);
app.use("/search", search_route_1.default);
(0, db_1.default)()
    .then(() => {
    server.listen(PORT, () => {
        console.log("server started");
    });
})
    .catch((err) => {
    console.log("error starting server ", err.message);
});

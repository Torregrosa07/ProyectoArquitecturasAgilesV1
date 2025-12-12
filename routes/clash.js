const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

// --- DATOS DE RESPALDO (POR SI FALLA LA API) ---
const CARTAS_BACKUP = [
    { id: 26000000, nombre: "Caballero", elixir: 3, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/jAj1Q5rclXxU9kVd0w3pIqB5_DSvBIATCX62RwY0ms0.png" },
    { id: 26000001, nombre: "Arqueras", elixir: 3, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/W4Hmp8MTSdXJOYqwvhtjiDzpNbSPLCzgXW0LIOMGc8u.png" },
    { id: 26000004, nombre: "PEKKA", elixir: 7, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/MlArURKhn_zWAZY-Xj1qIRKLVKquarG25BXDjUQhBsA.png" },
    { id: 26000010, nombre: "Gigante", elixir: 5, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/Axr4ox5_b7edjdazMnc3JztyNMvTr9183MFi36L6ej8.png" },
    { id: 26000011, nombre: "Valquiria", elixir: 4, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/0lIoYf3Y_plFTzo95zZL93JVxpfbGDG0Jy339y_wKKU.png" },
    { id: 26000012, nombre: "Ejército de Esqueletos", elixir: 3, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/fAOToOi5pRy7pteSWKd1rgy96JnuvFBSlo06oy7c9OY.png" },
    { id: 26000014, nombre: "Mosquetera", elixir: 4, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/Tex184ac3u4xlDlDSCVUmsxYZNYcNMqKnYbSjhlZNOs.png" },
    { id: 26000015, nombre: "Bebé Dragón", elixir: 4, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/cjC9n4AvEZJ3urkVh-rwBkJ-aRSsydIMqSAV48hAih0.png" },
    { id: 26000018, nombre: "Montapuercos", elixir: 4, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/Ubu0oUl8tZkusurZf8XbuqxGYpYBKqMwjT74M8DMIe0.png" },
    { id: 26000049, nombre: "Mago Eléctrico", elixir: 4, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/RsFaGdBHaDl45GP9Z2bts29PL16UK00LGPkjn5NQ84c.png" },
    { id: 28000000, nombre: "Bola de Fuego", elixir: 4, tipo: "Hechizo", imagen: "https://api-assets.clashroyale.com/cards/300/lZD9MILQv7O-P3XBr_xOLS5idG746RlwnyQlKxc86NM.png" },
    { id: 28000001, nombre: "Flechas", elixir: 3, tipo: "Hechizo", imagen: "https://api-assets.clashroyale.com/cards/300/5mI__Ex9kXWVkjGIn08H2y5kge_nSFhQ82r78M_JF5g.png" },
    { id: 28000008, nombre: "Descarga (Zap)", elixir: 2, tipo: "Hechizo", imagen: "https://api-assets.clashroyale.com/cards/300/7dxhJ5Ehra-7_b86-sXzS1hueQKHjXgQthmQ0sJj67k.png" },
    { id: 28000011, nombre: "El Tronco", elixir: 2, tipo: "Hechizo", imagen: "https://api-assets.clashroyale.com/cards/300/_iDwuDLexHPFZ_x4_a0eP-rxCS6vwWgTs6h9sxP4-DA.png" }
];

router.get('/cartas', auth, async (req, res) => {
    try {
        console.log("📡 Intentando conectar con API oficial...");
        
        // Intentamos conectar con la API oficial con un timeout corto (3s)
        const response = await axios.get('https://api.clashroyale.com/v1/cards', {
            headers: {
                'Authorization': `Bearer ${process.env.CLASH_API_TOKEN}`
            },
            timeout: 3000 
        });

        console.log("✅ Éxito: Usando datos oficiales");
        const cartasProcesadas = response.data.items.map(carta => ({
            id: carta.id,
            nombre: carta.name,
            elixir: carta.elixirCost || 0,
            tipo: carta.type || 'Tropa',
            imagen: carta.iconUrls.medium,
            maxLevel: carta.maxLevel || 14
        }));

        res.json(cartasProcesadas);

    } catch (error) {
        // SI FALLA, USAMOS EL BACKUP
        console.error("⚠️ Falló la API Oficial:", error.message);
        console.log("🔄 Usando cartas de RESPALDO (Modo Offline)");
        
        res.json(CARTAS_BACKUP); // Devolvemos el backup en vez de un error 500
    }
});

module.exports = router;
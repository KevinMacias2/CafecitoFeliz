import User from '../models/user.js';

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        // Validate password (basic comparison for practice context)
        if (user.password !== password) {
            return res.status(400).json({ msg: 'Password incorrecto' });
        }

        // If successful
        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            msg: 'Login exitoso'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        user = new User(req.body);
        await user.save();

        res.json({ msg: 'Usuario creado correctamente', user });
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}

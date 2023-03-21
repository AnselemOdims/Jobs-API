const homeController = (req, res) => {
    res.status(200).json({ code: '00', data: 'Welcome to our homepage', msg: 'Homepage retrieved successfully'})
}

module.exports = {
    homeController
}
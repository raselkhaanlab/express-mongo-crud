  exports.example = async (req,res) =>{
    return res.json([
      {
        product_name:"rice",
        unit_price:60.5
      },
      {
        product_name:"potato",
        unit_price:40.5
      }
    ]);
};
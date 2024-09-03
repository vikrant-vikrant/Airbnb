module.exports = (fn) =>{
  return (req,res,next)=>{
    fn(req,req,next).catch(next());
  };
};
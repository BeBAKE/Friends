import notFound from "../assets/notFound.svg"

const NotFound = ()=>{
  const style={  
    background: `url(${notFound})`,
    backgroundPosition: 'center',
    backgroundSize: 'fill',
    backgroundRepeat: 'repeat'
  }
  return <div className="h-screen w-screen flex flex-row overflow-hidden" style={style}>
  <h1 className="m-16 lg:text-[250px] md:text-[200px] text-[100px]">404 Not Found</h1>
  </div>
}

export default NotFound
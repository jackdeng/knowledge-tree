const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })

const PORT = 3000

const start = async () => {
  console.log(`warming up sever...`)
  const hotServer = await app.prepare() 

  console.log('creating request/response bridge...')
  const parameters = (request, response) => {
    const parseQuery = true
    const parsedUrl = parse(request.url, parseQuery)
    const { pathname, query } = parsedUrl
    const handle = hotServer.getRequestHandler() 
    handle(request, response, parsedUrl)
  }

  console.log('launch server...')
  const liveServer = await createServer(parameters)

  console.log('server listening...')
  const andHandleProblem = problem => { if (problem) throw problem }

  liveServer.listen(PORT, andHandleProblem)
  console.log('What would you like to know?')
}

start()
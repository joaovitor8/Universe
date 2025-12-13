import { FastifyInstance } from "fastify"
import axios from "axios"

// Clima espacial

export async function RouteDonki(app: FastifyInstance) {
  app.get("/api/donki/cme", async (request: any, reply) => {
    try {
      // Acessando dados enviados como parâmetros de consulta
      const aaa = request.query.date

      // Fazendo a solicitação para a API da NASA
      const response = await axios.get("https://api.nasa.gov/DONKI/CME", {
        params: {
          api_key: process.env.KEY_NASA,
          startDate: "2025-06-25",
          endDate: "2025-06-25",
        },
      })

      // Verifica se a resposta da API foi bem-sucedida
      if (response.status === 200) {
        const data = response.data

        // tratamento dos dados
        const processedData = data.map((dt: any) => ({
          activityID: dt.activityID,
          catalog: dt.catalog,
          startTime: dt.startTime,
          sourceLocation: dt.sourceLocation,
          activeRegionNum: dt.activeRegionNum,
          link: dt.link,
          note: dt.note,
          submissionTime: dt.submissionTime,
          instruments: dt.instruments.map((e: any) => ({
            displayName: e.displayName,
          })),
          linkedEvents: dt.linkedEvents,
          cmeAnalyses: dt.cmeAnalyses.map((e: any) => ({
            enlilList: e.enlilList,
            levelOfData: e.levelOfData,

            time21_5: e.time21_5,
            latitude: e.latitude,
            longitude: e.longitude,
            halfAngle: e.halfAngle,
            speed: e.speed,
            type: e.type,
            isMostAccurate: e.isMostAccurate,

            note: e.note,

            featureCode: e.featureCode,
            
            measurementTechnique: e.measurementTechnique,
            imageType: e.imageType,
            tilt: e.tilt,
            minorHalfWidth: e.minorHalfWidth,
            speedMeasuredAtHeight: e.speedMeasuredAtHeight,
            submissionTime: e.submissionTime,

            link: e.link,
          })),
        }))

        // Enviando os dados tratados para o front-end
        reply.send(data)
      } else {
        reply.status(response.status).send("Erro ao acessar a API da NASA")
      }
    } catch (error) {
      console.error(error)
      reply.status(500).send("Erro interno do servidor")
    }
  })

  // --------------------------------------------------

  app.get("/api/donki/cmea", async (request: any, reply) => {
    try {
      // Acessando dados enviados como parâmetros de consulta
      const aaa = request.query.date

      // Fazendo a solicitação para a API da NASA
      const response = await axios.get("https://api.nasa.gov/DONKI/CMEAnalysis", {
        params: {
          api_key: process.env.KEY_NASA,
          startDate: "2022-10-25",
          endDate: "2022-10-25",
        },
      })

      // Verifica se a resposta da API foi bem-sucedida
      if (response.status === 200) {
        const data = response.data

        // tratamento dos dados
        const processedData = data.map((dt: any) => ({}))

        // Enviando os dados tratados para o front-end
        reply.send(data)
      } else {
        reply.status(response.status).send("Erro ao acessar a API da NASA")
      }
    } catch (error) {
      console.error(error)
      reply.status(500).send("Erro interno do servidor")
    }
  })

  // --------------------------------------------------

  app.get("/api/donki/gst", async (request: any, reply) => {
    try {
      // Acessando dados enviados como parâmetros de consulta
      const data = request.query.date

      // Fazendo a solicitação para a API da NASA
      const response = await axios.get("https://api.nasa.gov/DONKI/GST", {
        params: {
          api_key: process.env.KEY_NASA,
          startDate: data,
          endDate: data,
        },
      })

      // Verifica se a resposta da API foi bem-sucedida
      if (response.status === 200) {
        const data = response.data

        // tratamento dos dados
        const processedData = data.map((dt: any) => ({
          gstId: dt.gstId,   // Identificador do GST
          startTime: dt.startTime, // Hora de início do GST
          link: dt.link, // Link para mais informações

          allKpIndex: dt.allKpIndex.map((e: any) => ({   // Mapeando os índices Kp
            observedTime: e.observedTime, // Hora observada
            kpIndex: e.kpIndex, // Índice Kp
            source: e.source, // Fonte do índice Kp
          })),
        }))

        // Enviando os dados tratados para o front-end
        reply.send(processedData)
      } else {
        reply.status(response.status).send("Erro ao acessar a API da NASA")
      }
    } catch (error) {
      console.error(error)
      reply.status(500).send("Erro interno do servidor")
    }
  })

  // --------------------------------------------------

  app.get("/api/donki/ips", async (request: any, reply) => {
    try {
      // Acessando dados enviados como parâmetros de consulta
      const aaa = request.query.date

      // Fazendo a solicitação para a API da NASA
      const response = await axios.get("https://api.nasa.gov/DONKI/IPS", {
        params: {
          api_key: process.env.KEY_NASA,
          startDate: "2025-05-10",
          endDate: "2025-07-10",
        },
      })

      // Verifica se a resposta da API foi bem-sucedida
      if (response.status === 200) {
        const data = response.data

        // tratamento dos dados
        const processedData = data.map((dt: any) => ({}))

        // Enviando os dados tratados para o front-end
        reply.send(data)
      } else {
        reply.status(response.status).send("Erro ao acessar a API da NASA")
      }
    } catch (error) {
      console.error(error)
      reply.status(500).send("Erro interno do servidor")
    }
  })

  // --------------------------------------------------

  app.get("/api/donki/flr", async (request: any, reply) => {
    try {
      // Acessando dados enviados como parâmetros de consulta
      const aaa = request.query.date

      // Fazendo a solicitação para a API da NASA
      const response = await axios.get("https://api.nasa.gov/DONKI/FLR", {
        params: {
          api_key: process.env.CHAVE_NASA,
          startDate: "2022-10-25",
          endDate: "2022-10-25",
        },
      })

      // Verifica se a resposta da API foi bem-sucedida
      if (response.status === 200) {
        const data = response.data

        // tratamento dos dados
        const processedData = data.map((dt: any) => ({}))

        // Enviando os dados tratados para o front-end
        reply.send(data)
      } else {
        reply.status(response.status).send("Erro ao acessar a API da NASA")
      }
    } catch (error) {
      console.error(error)
      reply.status(500).send("Erro interno do servidor")
    }
  })

  // --------------------------------------------------

  app.get("/api/donki/sep", async (request: any, reply) => {
    try {
      // Acessando dados enviados como parâmetros de consulta
      const aaa = request.query.date

      // Fazendo a solicitação para a API da NASA
      const response = await axios.get("https://api.nasa.gov/DONKI/SEP", {
        params: {
          api_key: process.env.CHAVE_NASA,
          // startDate: "2022-10-25",
          // endDate: "2022-10-25",
        },
      })

      // Verifica se a resposta da API foi bem-sucedida
      if (response.status === 200) {
        const data = response.data

        // tratamento dos dados
        const processedData = data.map((dt: any) => ({}))

        // Enviando os dados tratados para o front-end
        reply.send(data)
      } else {
        reply.status(response.status).send("Erro ao acessar a API da NASA")
      }
    } catch (error) {
      console.error(error)
      reply.status(500).send("Erro interno do servidor")
    }
  })

  // --------------------------------------------------

  app.get("/api/donki/mpc", async (request: any, reply) => {
    try {
      // Acessando dados enviados como parâmetros de consulta
      const aaa = request.query.date

      // Fazendo a solicitação para a API da NASA
      const response = await axios.get("https://api.nasa.gov/DONKI/MPC", {
        params: {
          api_key: process.env.CHAVE_NASA,
          // startDate: "2022-10-25",
          // endDate: "2022-10-25",
        },
      })

      // Verifica se a resposta da API foi bem-sucedida
      if (response.status === 200) {
        const data = response.data

        // tratamento dos dados
        const processedData = data.map((dt: any) => ({}))

        // Enviando os dados tratados para o front-end
        reply.send(data)
      } else {
        reply.status(response.status).send("Erro ao acessar a API da NASA")
      }
    } catch (error) {
      console.error(error)
      reply.status(500).send("Erro interno do servidor")
    }
  })

  // --------------------------------------------------

  app.get("/api/donki/rbe", async (request: any, reply) => {
    try {
      // Acessando dados enviados como parâmetros de consulta
      const aaa = request.query.date

      // Fazendo a solicitação para a API da NASA
      const response = await axios.get("https://api.nasa.gov/DONKI/RBE", {
        params: {
          api_key: process.env.CHAVE_NASA,
          // startDate: "2022-10-25",
          // endDate: "2022-10-25",
        },
      })

      // Verifica se a resposta da API foi bem-sucedida
      if (response.status === 200) {
        const data = response.data

        // tratamento dos dados
        const processedData = data.map((dt: any) => ({}))

        // Enviando os dados tratados para o front-end
        reply.send(data)
      } else {
        reply.status(response.status).send("Erro ao acessar a API da NASA")
      }
    } catch (error) {
      console.error(error)
      reply.status(500).send("Erro interno do servidor")
    }
  })

  // --------------------------------------------------

  app.get("/api/donki/hss", async (request: any, reply) => {
    try {
      // Acessando dados enviados como parâmetros de consulta
      const aaa = request.query.date

      // Fazendo a solicitação para a API da NASA
      const response = await axios.get("https://api.nasa.gov/DONKI/HSS", {
        params: {
          api_key: process.env.CHAVE_NASA,
          // startDate: "2022-10-25",
          // endDate: "2022-10-25",
        },
      })

      // Verifica se a resposta da API foi bem-sucedida
      if (response.status === 200) {
        const data = response.data

        // tratamento dos dados
        const processedData = data.map((dt: any) => ({}))

        // Enviando os dados tratados para o front-end
        reply.send(data)
      } else {
        reply.status(response.status).send("Erro ao acessar a API da NASA")
      }
    } catch (error) {
      console.error(error)
      reply.status(500).send("Erro interno do servidor")
    }
  })

  // --------------------------------------------------

  app.get("/api/donki/wsaes", async (request: any, reply) => {
    try {
      // Acessando dados enviados como parâmetros de consulta
      const aaa = request.query.date

      // Fazendo a solicitação para a API da NASA
      const response = await axios.get("https://api.nasa.gov/DONKI/WSAEnlilSimulations", {
        params: {
          api_key: process.env.CHAVE_NASA,
          // startDate: "2022-10-25",
          // endDate: "2022-10-25",
        },
      })

      // Verifica se a resposta da API foi bem-sucedida
      if (response.status === 200) {
        const data = response.data

        // tratamento dos dados
        const processedData = data.map((dt: any) => ({}))

        // Enviando os dados tratados para o front-end
        reply.send(data)
      } else {
        reply.status(response.status).send("Erro ao acessar a API da NASA")
      }
    } catch (error) {
      console.error(error)
      reply.status(500).send("Erro interno do servidor")
    }
  })

  // --------------------------------------------------

  app.get("/api/donki/notf", async (request: any, reply) => {
    try {
      // Acessando dados enviados como parâmetros de consulta
      const aaa = request.query.date

      // Fazendo a solicitação para a API da NASA
      const response = await axios.get("https://api.nasa.gov/DONKI/notifications", {
        params: {
          api_key: process.env.CHAVE_NASA,
          startDate: "2022-10-25",
          endDate: "2022-10-25",
        },
      })

      // Verifica se a resposta da API foi bem-sucedida
      if (response.status === 200) {
        const data = response.data

        // tratamento dos dados
        const processedData = data.map((dt: any) => ({}))

        // Enviando os dados tratados para o front-end
        reply.send(data)
      } else {
        reply.status(response.status).send("Erro ao acessar a API da NASA")
      }
    } catch (error) {
      console.error(error)
      reply.status(500).send("Erro interno do servidor")
    }
  })
}



// https://api.nasa.gov/DONKI/CME?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=DEMO_KEY
// https://api.nasa.gov/DONKI/CMEAnalysis?startDate=2016-09-01&endDate=2016-09-30&mostAccurateOnly=true&speed=500&halfAngle=30&catalog=ALL&api_key=DEMO_KEY
// https://api.nasa.gov/DONKI/GST?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=DEMO_KEY
// https://api.nasa.gov/DONKI/IPS?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&location=LOCATION&catalog=CATALOG&api_key=DEMO_KEY
// https://api.nasa.gov/DONKI/FLR?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=DEMO_KEY
// https://api.nasa.gov/DONKI/SEP?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=DEMO_KEY
// https://api.nasa.gov/DONKI/MPC?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=DEMO_KEY
// https://api.nasa.gov/DONKI/RBE?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=DEMO_KEY
// https://api.nasa.gov/DONKI/HSS?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=DEMO_KEY
// https://api.nasa.gov/DONKI/WSAEnlilSimulations?startDate=2011-09-19&endDate=2011-09-20&api_key=DEMO_KEY
// https://api.nasa.gov/DONKI/notifications?startDate=2014-05-01&endDate=2014-05-08&type=all&api_key=DEMO_KEY

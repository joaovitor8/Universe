/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useCallback, useEffect, useState } from "react"
import axios from "axios"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ExternalLink } from "lucide-react"

import { TypeAsteroidsFeed } from "@/components/Types"
import Loading from "@/app/loading"


export const Feed = () => {
  const [asteroidsFeed, setAsteroidsFeed] = useState<TypeAsteroidsFeed[]>([])
  const [date, setDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const apiOff = "http://127.0.0.1:4000"
  const apiOn = "https://api-universe.onrender.com"


  const GetFeed = useCallback(() => {
    setLoading(true)
    setError(null)
    try {
      const formatDate = date.toISOString().split('T')[0];

      axios.get(`${apiOn}/api/neows/feed?date=${formatDate}`)
        .then((res) => setAsteroidsFeed(res.data))
        .catch((err) => {
          console.error(err)
          setError("Failed to fetch asteroid data. The API might be down or the date is invalid.")
          setAsteroidsFeed([])
        })
        .finally(() => setLoading(false))

    } catch (err) {
      console.error("Client-side error:", err)
      setError("An unexpected error occurred.")
      setLoading(false)
    }
  }, [date])

  useEffect(() => {
    GetFeed()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Near Earth Objects Feed</h1>
        <p className="text-muted-foreground mt-2">Browse asteroids based on their closest approach date to Earth.</p>
      </div>

      <div className="flex justify-center items-center gap-2 mb-8">
        <Input
          type="date"
          value={date.toISOString().split('T')[0]}
          onChange={(e) => setDate(new Date(e.target.value))}
          className="max-w-xs"
        />
        <Button onClick={GetFeed} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="text-center p-12 border-2 border-dashed border-red-500 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <div className="border border-slate-800 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Magnitude</TableHead>
                {/* <TableHead className="text-center">Sentry Object</TableHead> */}
                <TableHead className="text-center">Potentially Hazardous</TableHead>
                <TableHead className="text-right">More Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asteroidsFeed.length > 0 ? (
                asteroidsFeed.map((asteroid) => (
                  <TableRow key={asteroid.id}>
                    <TableCell>{asteroid.id}</TableCell>
                    <TableCell className="font-medium">{asteroid.name.replace(/[()]/g, '')}</TableCell>
                    <TableCell className="text-center">{asteroid.absolute_magnitude_h}</TableCell>
                    {/* <TableCell className={`text-center ${asteroid.sentry_object ? "destructive" : "secondary"}`} >
                        {asteroid.sentry_object ? "Yes" : "No"}
                    </TableCell> */}
                    <TableCell className={`text-center ${asteroid.potentially_hazardous ? "destructive" : "secondary"}`} >
                        {asteroid.potentially_hazardous ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="text-right">
                      <a href={asteroid.nasa_jpl_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-purple-400 hover:text-purple-300">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No asteroids found for this date.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

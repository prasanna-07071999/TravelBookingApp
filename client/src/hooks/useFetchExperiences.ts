import { useState, useEffect } from "react";
import { fetchExperiences } from "@/lib/api";
import { Experience } from "@/types/experience";

const useFetchExperience = () => {
    const [experiences, setExperiences] = useState<Experience[]>([])
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState<string|null>(null);

    useEffect (() => {
        async function loadData() {
            try{
                const data = await fetchExperiences()
                setExperiences(data)
                setError(null)
            } catch(e:any){
                setError(e.message)
                setExperiences([])
            } finally{
                setLoading(false)
            }
        }
        loadData()
    }, [])
    return {experiences, isLoading, error}
}
export default useFetchExperience
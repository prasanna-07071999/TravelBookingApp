const Base_API_Url = 'https://travelbookingapp-backend.onrender.com'

export const fetchExperiences = async () =>{
    const response = await fetch(`${Base_API_Url}/experiences`)
    if (response.ok){
        return response.json()
    } else{
        throw new Error("Failed to fetch Experiences")
    }
}

export const fetchBooking = async (id: string) => {
    const response = await fetch(`${Base_API_Url}/bookings/${id}`)
    if (response.ok){
        return response.json()
    } else{
        throw new Error("Failed to fetch Bookings")
    }
}


export async function getExperienceById(id: string) {
  const res = await fetch(`${Base_API_Url}/experiences/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch experience');
  }
  return res.json();
}


const PostedJobsPage = () => {
  return (
    <>
    <div className="min-h-screen bg-mine-shaft-950 w-auto h-auto flex flex-col">
      <Header />
      <div className="flex-grow">
        <PostedJobs/>
      </div>
      <Footer />
    </div>
 
    </>
  )
}

export default PostedJobsPage
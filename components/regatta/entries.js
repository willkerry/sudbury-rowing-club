function Entries({children}) {
  return <div>
    <div className="mx-auto prose" dangerouslySetInnerHTML={{ __html: children }}/>
  </div>;
}

export default Entries;

const RELEASE_API = "https://api.github.com/repos/vhxLUA-max/cheezie-releases/releases/latest";
const DOWNLOAD_URL = "https://github.com/vhxLUA-max/cheezie-releases/releases/latest/download/Cheezie.exe";

const releaseStatus = document.getElementById("releaseStatus");
const versionBadge = document.getElementById("versionBadge");
const versionDetails = document.getElementById("versionDetails");

function cleanVersion(tag){
  if(!tag) return "Latest";
  return tag.startsWith("v") ? tag : `v${tag}`;
}

function setReleaseState({version="Latest", details="Latest release", ready=false}){
  if(releaseStatus){
    releaseStatus.textContent = ready ? `${version} available` : details;
  }
  if(versionBadge) versionBadge.textContent = version;
  if(versionDetails) versionDetails.textContent = details;
}

async function loadRelease(){
  try{
    const response = await fetch(RELEASE_API, {
      headers: {Accept: "application/vnd.github+json"},
      cache: "no-store"
    });

    if(!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const release = await response.json();
    const version = cleanVersion(release.tag_name);
    const published = release.published_at
      ? new Intl.DateTimeFormat(undefined,{year:"numeric",month:"short",day:"numeric"}).format(new Date(release.published_at))
      : "recently";

    setReleaseState({
      version,
      details: `Published ${published}`,
      ready: true
    });
  }catch(error){
    setReleaseState({
      version: "Latest",
      details: "Release information will appear here when a build is published.",
      ready: false
    });
  }
}

document.querySelectorAll(`a[href*="cheezie-releases/releases/latest/download/Cheezie.exe"]`).forEach(link=>{
  link.href = DOWNLOAD_URL;
  link.addEventListener("click",()=>{
    link.setAttribute("aria-busy","true");
    setTimeout(()=>link.removeAttribute("aria-busy"),1200);
  });
});

loadRelease();

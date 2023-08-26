const isPortrait = (): boolean => {
	let isPortraid = false;
	try {
		if(window.screen.orientation.type.startsWith("portrait")) {
			isPortraid = true;
		}
	}
	catch(err){
		isPortraid = true;
	}

	return isPortraid
}

export default isPortrait;
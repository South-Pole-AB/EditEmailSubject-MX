async function okAndInput(e) {
    let message = await messenger.runtime.sendMessage({action: "requestData"});
	if ((e.type == "keydown" && e.key == "Enter") || e.type == "click") {
		await messenger.runtime.sendMessage({action: "requestUpdate", newSubject: document.getElementById("editemailsubjectInput").value});
		const windowId = (await messenger.windows.getCurrent()).id;
		await messenger.windows.remove(windowId);
	}
	
	if (e.type == "keydown" && e.key == "Escape") {
		const windowId = (await messenger.windows.getCurrent()).id;
		await messenger.windows.remove(windowId);	
	}
}

async function cancel(e) {
	const windowId = (await messenger.windows.getCurrent()).id;
	await messenger.windows.remove(windowId);
}

async function getPrefValue(aName, aFallback = null) {
    let defaultValue = await messenger.storage.local.get({ ["pref.default." + aName] : aFallback });
    let value = await messenger.storage.sync.get({ ["pref.value." + aName] :  defaultValue["pref.default." + aName] });
    return value["pref.value." + aName];
}

async function load() {
	document.getElementById("editemailsubjectCANCEL").addEventListener('click', cancel);
	document.getElementById("editemailsubjectOK").addEventListener('click', okAndInput);
	document.getElementById("editemailsubjectInput").addEventListener('keydown', okAndInput);

	let msg = await messenger.runtime.sendMessage({action: "requestData"});

        var newSubjectPrefix = await getPrefValue("defaultSubjectPrefix");
        let date = new Date().toLocaleDateString();
        let time = new Date().toLocaleTimeString();
        if( newSubjectPrefix ) {
            newSubjectPrefix =
                newSubjectPrefix
                .replace('${date}', date)
                .replace('${time}', time);
        }
        
        document.getElementById("editemailsubjectInput").value = newSubjectPrefix + msg.subject;

	if (msg.alreadyModified && msg.headers && msg.headers.hasOwnProperty("x-editemailsubject-originalsubject")) {
		document.getElementById("editemailsubjectOld").value = msg.headers["x-editemailsubject-originalsubject"];
	} else {
		document.getElementById("modifiedInfo").style.display = "none";
	}
	
	document.getElementById("body").style.display = "block";
	document.getElementById("editemailsubjectInput").focus();

}

document.addEventListener('DOMContentLoaded', load, { once: true });

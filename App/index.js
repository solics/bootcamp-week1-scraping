let btnscrap = document.getElementById('scrap-profile')

btnscrap.addEventListener('click', async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

	if (tab !== null) {
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			function: scrapingProfile,
		})
	}
})

const scrapingProfile = () => {
	const wait = function (milliseconds) {
		return new Promise(function (resolve) {
			setTimeout(function () {
				resolve()
			}, milliseconds)
		})
	}
	const profile = {}
	console.group('Loading information...')
	;(async () => {
		/**************************************************************************
		 *****************  SCRAPING PERSONAL INFORMATION START ******************
		 **************************************************************************/
		const elementNameProfile = document.querySelector('div.ph5.pb5 > div.display-flex.mt2 ul li')
		const elementNameTitle = document.querySelector('div.ph5.pb5 > div.display-flex.mt2 h2')
		const elementLocation = document.querySelector('.pv-top-card--list.pv-top-card--list-bullet .t-normal')
		const btnSeeMore = document.querySelector('#line-clamp-show-more-button')

		if (btnSeeMore) btnSeeMore.click()

		await wait(500)
		const elementAbout = document.querySelector('section.pv-about-section > p')

		profile['name'] = elementNameProfile ? elementNameProfile.innerText : ''
		profile['title'] = elementNameTitle ? elementNameTitle.innerText : ''
		profile['location'] = elementLocation ? elementLocation.innerText : ''
		profile['resume'] = elementAbout ? elementAbout.innerText : ''
		/**************************************************************************
		 *****************  SCRAPING PERSONAL INFORMATION END ********************
		 **************************************************************************/

		/**************************************************************************
		 **********************  SCRAPING EXPERIENCE START ***********************
		 **************************************************************************/
		document.getElementById('experience-section').scrollIntoView()
		await wait(1000)
		const seeMoreExp = document.querySelector(
			'#experience-section .pv-experience-section__see-more .pv-profile-section__see-more-inline'
		)
		if (seeMoreExp) seeMoreExp.click()
		await wait(1000)
		const blockExperience = document.querySelectorAll('#experience-section ul li')
		profile['experience'] = []
		for (let elem of blockExperience) {
			const elementCompany =
				elem.querySelector('.pv-entity__summary-info h3') ||
				elem.querySelectorAll('.pv-entity__company-summary-info h3 span')[1]
			const companyName = elementCompany?.innerText

			if (!companyName) continue
			const secondaryTitle = elem.querySelector('.pv-entity__summary-info .pv-entity__secondary-title ')?.innerText
			let range = elem.querySelectorAll('.pv-entity__summary-info .pv-entity__date-range span')
			if (range.length === 0) range = elem.querySelectorAll('.pv-entity__company-summary-info h4 span')

			const period = range && range[1] ? range[1].innerText : 'no information'
			profile['experience'].push({
				companyName,
				secondaryTitle,
				period,
			})
		}
		/**************************************************************************
		 **********************  SCRAPING EXPERIENCE END *************************
		 **************************************************************************/

		/**************************************************************************
		 **********************  SCRAPING EDUCATION START ************************
		 **************************************************************************/
		document.getElementById('education-section').scrollIntoView()
		await wait(1000)
		const seeMoreEdu = document.querySelector('#education-section .pv-profile-section__see-more-inline')
		if (seeMoreEdu) seeMoreEdu.click()
		await wait(1000)
		const blockEducation = document.querySelectorAll('#education-section ul li')
		profile['education'] = []
		for (let elem of blockEducation) {
			const schoolName = elem.querySelector('.pv-entity__school-name')?.innerText
			const secondaryTitle = elem.querySelector('.pv-entity__secondary-title')?.innerText
			const dates = elem.querySelectorAll('.pv-entity__dates time')
			const start = dates && dates[0] ? dates[0].innerText : 'no information'
			const end = dates && dates[1] ? dates[1].innerText : 'no information'
			profile['education'].push({
				schoolName,
				secondaryTitle,
				dates: { start, end },
			})
		}
		/**************************************************************************
		 **********************  SCRAPING EDUCATION END **************************
		 **************************************************************************/

		console.log(profile)
	})()
}

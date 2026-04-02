/**
 * NGO Frontend — Centralized Dummy Data Store
 * This file contains all placeholder content for the website.
 * It is used as a fallback when the backend API is unreachable.
 */

const DUMMY_DATA = {
    homepage: {
        banner: {
            header: 'Registered NGO · Since 2012',
            title: 'Building Bridges.<br/>Changing <span class="accent-word">Lives.</span>',
            description: 'RootsBridge connects passionate people with underserved communities across West Africa — delivering education, clean water, healthcare, and opportunity to those who need it most.',
            bannerSummary: [
                { figure: '2,841', label: 'Beneficiaries' },
                { figure: '8', label: 'Active Programs' },
                { figure: '₦18M+', label: 'Funds Raised' },
                { figure: '347', label: 'Volunteers' }
            ]
        },
        whatWeDo: {
            header: 'What We Do',
            title: 'Programs Making<br/>Real Impact',
            description: 'From literacy to clean water — our six flagship programs address the most pressing needs of communities across West Africa.',
            items: [] // Populated from programs
        },
        quote: {
            text: 'Before RootsBridge came, my children walked 5km for water. Now we have a borehole 200 meters from our door. This is everything.',
            author: '— Mama Ngozi, Beneficiary · Cross River State, 2024',
            cards: [
                { figure: '95%', label: 'improved quality of life' },
                { figure: '100%', label: 'donations tracked' },
                { figure: '12yr', label: 'community service' },
                { figure: '4.9★', label: 'accountability rating' }
            ]
        },
        testimonials: {
            header: 'Voices of Impact',
            title: 'Stories That Move Us',
            items: [
                { text: '"Volunteering with RootsBridge transformed my perspective on development. I came to give, but I left enriched beyond measure."', author: 'Emeka Okafor', location: 'Volunteer · Lagos, 2024', avatar: '👨', color: 'si-green' },
                { text: '"The Child Literacy Drive gave my daughter access to books and a teacher for the first time. She now reads better than children in the city."', author: 'Fatima Aliyu', location: 'Beneficiary · Kano State', avatar: '👩', color: 'si-terra' },
                { text: '"As a donor, transparency matters. RootsBridge sends quarterly reports with photos and impact data. I know exactly where my money goes."', author: 'Dr. Chukwu Eze', location: 'Monthly Donor · Abuja', avatar: '🧒', color: 'si-gold' }
            ]
        },
        partners: ['🌍 USAID Nigeria', '🏛️ Lagos State Govt', '🤝 United Way', '🌐 UNICEF West Africa', '💼 Tony Elumelu Foundation', '🏥 WHO Nigeria']
    },

    news: {
        header: 'News & Stories 📰',
        title: '',
        description: 'Real stories from the field. Updates from our programs. Impact that you helped create.',
        cards: [
            { tag: 'Program Update', title: 'Child Literacy Drive Hits 80% Target — 482 Children Now in School', excerpt: 'After 9 months of field work across Lagos Island and Abuja Municipal, our flagship program has enrolled 482 children who had never set foot in a classroom.', date: 'March 20, 2025' },
            { tag: 'Field Report', title: '18 New Boreholes Installed in Kano Communities This Quarter', excerpt: 'Our Clean Water Initiative team completed the third phase of borehole installations, bringing safe water access to over 3,200 residents across 6 Kano communities.', date: 'March 15, 2025' },
            { tag: 'Recognition', title: 'RootsBridge Wins "Best NGO 2024" Award at Lagos Development Summit', excerpt: 'We were humbled to receive the NGO Accountability Board\'s highest honour, recognizing our transparent reporting and measurable community outcomes.', date: 'March 2, 2025' },
            { tag: 'Impact Story', title: 'How a ₦150,000 Micro-Loan Changed Everything for Mama Adaeze', excerpt: 'Mama Adaeze was selling groundnuts on the roadside when RootsBridge found her. Two years later, she runs a thriving fabric business employing 4 women.', date: 'Feb 28, 2025' },
            { tag: 'Program Launch', title: 'New Food Security Program Launches in Benue and Nasarawa States', excerpt: '290 smallholder farmers across the North-Central food belt will receive training, seeds, and market access through our newest program, launching April 2025.', date: 'Feb 20, 2025' },
            { tag: 'Partnerships', title: 'Tony Elumelu Foundation Pledges ₦5M to RootsBridge Youth Skills Program', excerpt: 'A landmark partnership that will scale the Youth Skills Training program to cover Lagos, Abuja, and Port Harcourt — reaching 500 young Nigerians by December 2025.', date: 'Feb 10, 2025' }
        ]
    },

    programs: {
        banner: {
            header: 'Active Initiatives',
            title: 'Our Programs',
            description: 'Six programs. One mission. Transforming lives across West Africa\'s most underserved communities.'
        },
        card: [
            { header: 'Education',   title: 'Child Literacy Drive',        description: 'Enrolling out-of-school children aged 6–14 in structured literacy programs, providing materials, trained teachers, and parental support.', progress: 80, reaching: '482 children',  icon: '', image: '', buttonText: 'Learn More', buttonLink: '#' },
            { header: 'Health',      title: 'Clean Water Initiative',       description: 'Installing boreholes, solar-powered pumps, and water filtration systems in remote communities without access to safe drinking water.', progress: 65, reaching: '318 families',  icon: '', image: '', buttonText: 'Learn More', buttonLink: '#' },
            { header: 'Health',      title: 'Rural Health Outreach',        description: 'Quarterly medical camps, immunizations, and maternal health services reaching women and children in underserved rural areas.', progress: 92, reaching: '721 patients',  icon: '', image: '', buttonText: 'Learn More', buttonLink: '#' },
            { header: 'Empowerment', title: 'Women in Business',            description: 'Micro-loans up to ₦150,000, 6-week business bootcamp, and ongoing mentorship for women-led micro enterprises.', progress: 45, reaching: '203 women',    icon: '', image: '', buttonText: 'Learn More', buttonLink: '#' },
            { header: 'Livelihood',  title: 'Youth Skills Training',        description: 'Technical and vocational training in carpentry, electrical work, fashion design, and digital literacy for unemployed youth aged 16–25.', progress: 30, reaching: '156 youth',    icon: '', image: '', buttonText: 'Learn More', buttonLink: '#' },
            { header: 'Environment', title: 'Food Security & Farming',      description: 'Teaching smallholder farmers modern, climate-resilient farming techniques and connecting them with cooperative markets.', progress: 58, reaching: '290 farmers',  icon: '', image: '', buttonText: 'Learn More', buttonLink: '#' }
        ]
    },

    about: {
        banner: {
            header: 'Our Story',
            title: 'Who We Are',
            description: 'A community of changemakers, bound by one belief: every person deserves the dignity of opportunity.'
        },
        ourMission: {
            header: 'Our Mission',
            title: 'More Than Charity — <em>Partnership</em>',
            description: 'RootsBridge was founded in 2012 by a group of Nigerian professionals who believed that sustainable development isn\'t about doing things for communities — it\'s about doing things with them.\n\nWe embed ourselves in communities for months before launching any intervention. We listen first. We design together. We measure together. And we celebrate together when targets are hit.',
            cards: [
                { title: 'Sustainability',  description: 'Every project is built to thrive beyond our involvement.' },
                { title: 'Partnership',     description: 'We work with communities, never above them.' },
                { title: 'Transparency',    description: 'Every naira tracked and publicly reported.' },
                { title: 'Impact-First',    description: 'We measure outcomes, not activities.' }
            ]
        },
        ourVision: {
            icon: '',
            title: 'Our Vision',
            description: 'A West Africa where every child can read, every family has clean water, and every woman has the tools to build economic independence. We are 12 years into that mission.',
            progress: 73
        },
        team: {
            header: 'The People',
            title: 'Meet Our Leadership',
            description: 'The dedicated professionals behind AWEDI\'s impact across West Africa.',
            card: [
                { name: 'Dr. Amina Yusuf',  role: 'Executive Director & Co-founder', image: '' },
                { name: 'Chukwu Eze PhD',   role: 'Director of Programs',            image: '' },
                { name: 'Fatima Bello',     role: 'Head of Field Operations',        image: '' },
                { name: 'Ibrahim Hassan',   role: 'Finance & Compliance Lead',       image: '' }
            ]
        },
        ourJourney: [
            { year: '2012', title: 'RootsBridge Founded',           description: '7 passionate Nigerians. A shared vision. Our first literacy program reached 40 children.' },
            { year: '2015', title: 'Expansion to 5 States',        description: 'Opened field offices in Kano, Cross River, and Delta. Launched Clean Water Initiative.' },
            { year: '2018', title: '1,000 Beneficiaries Milestone', description: 'Celebrated reaching our first thousand beneficiaries. Launched Women in Business.' },
            { year: '2021', title: 'COVID-19 Emergency Response',   description: 'Pivoted to food relief and health kits reaching 480 vulnerable families.' },
            { year: '2024', title: 'Best NGO Award',               description: 'Recognized by the NGO Accountability Board for excellence in community development.' }
        ]
    },

    dashboard: {
        welcomeMsg: 'Welcome Back, Admin',
        stats: [
            { label: 'Total Donations', value: '₦24,502,000', change: '↑ 12% from last month', color: 'var(--accent)' },
            { label: 'Active Volunteers', value: '347', change: '↑ 4 new today', color: 'var(--terra)' },
            { label: 'Communities Served', value: '18', change: '2 pending expansion', color: 'var(--gold)' }
        ],
        donationTrends: [
            { month: 'JAN', value: 40, label: '₦1.2M' },
            { month: 'FEB', value: 65, label: '₦2.1M' },
            { month: 'MAR', value: 55, label: '₦1.8M' },
            { month: 'APR', value: 85, label: '₦3.4M' },
            { month: 'MAY', value: 75, label: '₦2.9M' },
            { month: 'JUN', value: 95, label: '₦4.1M' }
        ],
        recentActivity: [
            { msg: '<strong>₦50,000</strong> donation received from anonymous.', time: '2 mins ago', color: 'green' },
            { msg: 'New volunteer <strong>Amaka O.</strong> joined the literacy program.', time: '45 mins ago', color: 'terra' },
            { msg: 'Clean Water Project in <strong>Kano</strong> marked as 80% complete.', time: '3 hours ago', color: 'blue' },
            { msg: 'Monthly impact report for <strong>February</strong> has been generated.', time: 'Yesterday', color: 'gold' }
        ]
    },

    contact: {
        title: 'Get In Touch ✉️',
        description: 'Whether you want to partner, donate, volunteer, or just say hello — we\'d love to hear from you.',
        office: '14 Blantyre Street, Wuse 2, Abuja, Nigeria',
        phone: '+234 803 456 7890<br/>+234 901 234 5678',
        email: 'info@rootsbridge.org<br/>volunteer@rootsbridge.org<br/>media@rootsbridge.org'
    },

    donation: {
        banner: {
            title: 'Make a Donation 💚',
            description: 'Your generosity funds real programs that change real lives. 100% of online donations go to the field — no admin cuts.'
        },
        amounts: [2500, 5000, 10000, 25000, 50000],
        impacts: [
            { icon: '📚', text: 'Provide 1 child with school materials for a full term' },
            { icon: '💧', text: 'Fund 2 days of clean water testing for a community' },
            { icon: '💊', text: 'Cover medication for 3 patients at a health camp' },
            { icon: '🌱', text: 'Supply seeds and tools for one farming family' }
        ],
        progress: {
            goalLabel: 'Annual Goal: ₦25,000,000',
            current: 18400000,
            target: 25000000,
            percent: 73.6,
            donors: 142,
            avgDonation: '₦130k'
        },
        bank: 'Account Name: RootsBridge NGO<br/>Bank: Access Bank<br/>Account No: 0123456789<br/><br/>Please use your name as reference.'
    },

    volunteer: {
        banner: {
            header: 'Join the Movement',
            title: 'Volunteer With Us ❤️',
            description: 'You have skills. Communities need them. Let\'s connect the dots — and change lives together.'
        },
        header: 'Why Volunteer',
        title: 'What You\'ll Gain',
        card: [
            { icon: '🌍', title: 'Real-World Impact',         description: 'See the direct difference your work makes in communities. We share detailed impact reports with every volunteer.' },
            { icon: '🎓', title: 'Certificate & Recognition', description: 'Receive an internationally recognized certificate of service and letter of recommendation after 3 months.' },
            { icon: '🤝', title: 'Network of Change-makers',  description: 'Join 347 active volunteers across Nigeria — professionals, students, and passionate individuals.' },
            { icon: '📸', title: 'Documented Journey',        description: 'Professional field photography of your work. Stories featured on our platforms (with your consent).' },
            { icon: '🧠', title: 'Skills Development',        description: 'Training in project management, community mobilization, and development sector best practices.' },
            { icon: '💚', title: 'Personal Fulfillment',      description: '95% of our volunteers report the experience as one of the most meaningful of their lives.' }
        ]
    }
};

// Global Exposure
window.DUMMY_DATA = DUMMY_DATA;

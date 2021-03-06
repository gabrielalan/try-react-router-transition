import React from 'react'
import { TransitionMotion, spring } from 'react-motion'
import Router from 'react-router/BrowserRouter'
import Match from 'react-router/Match'
// import Miss from 'react-router/Miss'
import Link from 'react-router/Link'
import Redirect from 'react-router/Redirect'

const styles = {}

styles.fill = {
	position: 'absolute',
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	overflow: 'hidden'
}

styles.content = {
	...styles.fill,
	top: '40px',
	textAlign: 'center'
}

styles.nav = {
	padding: 0,
	margin: 0,
	position: 'absolute',
	top: 0,
	height: '40px',
	width: '100%',
	display: 'flex'
}

styles.navItem = {
	textAlign: 'center',
	flex: 1,
	listStyleType: 'none',
	padding: '10px'
}

styles.hsl  = {
	...styles.fill,
	color: 'white',
	paddingTop: '20px',
	fontSize: '30px'
}

const HSL = React.createClass({

	componentDidMount() {
		console.log('mount HSL');
	},

	componentDidUpdate() {
		console.log('update HSL');
	},

	render() {
		var params = this.props.params;

		return (
			<div style={{
				...styles.hsl,
				background: `hsl(${params.h}, ${params.s}%, ${params.l}%)`
			}}>hsl({params.h}, {params.s}%, {params.l}%)</div>
		)
	}
});

const AnimationExample = () => (
	<Router>
		<div style={styles.fill}>
			<ul style={styles.nav}>
				<NavLink to="/10/50/50">Red</NavLink>
				<NavLink to="/50/70/50">Yellow</NavLink>
				<NavLink to="/200/50/50">Blue</NavLink>
				<NavLink to="/300/50/50">Dunno</NavLink>
			</ul>

			<div style={styles.content}>
				<MatchWithFade pattern="/:h/:s/:l" component={HSL}/>
			</div>

			<Match exactly pattern="/" render={() => (
				<Redirect to="/10/50/50"/>
			)}/>
		</div>
	</Router>
)

const MatchWithFade = ({ component:Component, ...rest }) => {
	const willEnter = () => {
		return ({ zIndex: 2, translateX: spring(0) })
	}

	const willLeave = () => {
		return ({ zIndex: 1, translateX: spring(100) })
	}

	return (
		<Match {...rest} children={({ matched, ...props }) => (
			<TransitionMotion
				willLeave={willLeave}
				willEnter={willEnter}
				styles={matched ? [ {
					key: props.location.pathname,
					style: { translateX: 0 },
					data: props
				} ] : [{
					key: props.location.pathname,
					style: { translateX: 0 },
					data: props
				}]}
			>
				{interpolatedStyles => (
					<div>
						{interpolatedStyles.map(config => (
							<div
								key={config.key}
								style={{
									...styles.fill,
									zIndex: config.style.zIndex,
									transform: `translateX(${config.style.translateX}%)`
								}}
							>
								<Component {...config.data}/>
							</div>
						))}
					</div>
				)}
			</TransitionMotion>
		)}/>
	)
}

const NavLink = (props) => (
	<li style={styles.navItem}>
		<Link {...props} style={{ color: 'inherit' }}/>
	</li>
)

export default AnimationExample
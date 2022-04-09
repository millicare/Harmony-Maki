import React from 'react';

import myTokens from '../../test/mytoken';
// import Tokens from './Tokens';

function MyTokenTable() {
	return (
		<table className="w-full dark:text-white">
			<thead>
				<tr className="text-green-300 text-sm">
				<th className="text-left py-2">Token</th>
				<th className="text-right">Price</th>
				<th className="text-right">Amount</th>
				</tr>
			</thead>
			<tbody>
			{
				myTokens.map((token, i) => (
				<tr className="hover:bg-gray-100 dark:hover:bg-gray-700 text-sm" key={i}>
					<td className="text-left py-2">{token.name}</td>
					<td className="text-right">{token.price}</td>
					<td className="text-right">{token.amount}</td>
				</tr>
				))
			}
			</tbody>
		</table>
	);
}

export default MyTokenTable;
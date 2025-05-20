import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayWhePredictionTable } from './PredictionTable';
import CommentSection from '@/components/ui/CommentSection';

const patternsConfig = [
	{
		title: 'Current Sequential Combinations matching Previous Sequential Combinations',
		csv: '/csv/pwhzprjcur.csv',
		columns: [
			{ key: 'Combis', header: 'Combis', width: 'auto', truncate: true },
			{ key: 'Following', header: 'Following', width: 'auto', truncate: true },
			{ key: 'ComPlay', header: 'ComPlay', width: 'auto' },
			{ key: 'FollPlay', header: 'FollPlay', width: 'auto' },
			{ key: 'Pct', header: 'Pct', width: 'auto' },
			{ key: 'ComDrPlay', header: 'ComDrPlay', width: 'auto' }
		],
		sortBy: ['Pct'],
		ascending: false,
		mapRow: row => ({
			Combis: row.Combis,
			Following: row.Following,
			ComPlay: row.ComPlay,
			FollPlay: row.FollPlay,
			Pct: row.Pct,
			ComDrPlay: row.ComDrPlay
		})
	},	{
		title: "Current Week's Patterns matching Previous Week's Patterns",
		csv: '/csv/pwwkass.csv',
		columns: [
			{ key: 'Combinations', header: 'Combinations', width: '18%', truncate: true },
			{ key: 'Ass', header: 'Ass', width: '12%', truncate: true },
			{ key: 'ComPlay', header: 'ComPlay', width: '13%' },
			{ key: 'AssPlay', header: 'AssPlay', width: '13%' },
			{ key: 'Pct', header: 'Pct', width: '10%' },
			{ key: 'AssWksPlay', header: 'AssWksPlay', width: '15%' },
			{ key: 'PlayThisWk', header: 'PlayThisWk', width: '13%', truncate: true }
		],
		sortBy: ['ComPlay', 'Ass'],
		ascending: false,
		mapRow: row => ({
			Combinations: row.Combinations,
			Ass: row.Ass,
			ComPlay: row.ComPlay,
			AssPlay: row.AssPlay,
			Pct: row.Pct,
			AssWksPlay: row.AssWksPlay,
			PlayThisWk: row.PlayThisWk
		})
	},	{
		title: 'Current Sequential Lines Combinations matching Previous Sequential Lines Combinations',
		csv: '/csv/pwhzprjlin.csv',
		columns: [
			{ key: 'Combis', header: 'Combis', width: '18%', truncate: true },
			{ key: 'Following', header: 'Following', width: '18%', truncate: true },
			{ key: 'ComPlay', header: 'ComPlay', width: '12%' },
			{ key: 'FollPlay', header: 'FollPlay', width: '12%' },
			{ key: 'Pct', header: 'Pct', width: '10%' },
			{ key: 'ComDrPlay', header: 'ComDrPlay', width: '20%' },
			{ key: 'ID', header: 'ID', width: '10%' }
		],
		sortBy: ['Pct'],
		ascending: false,
		mapRow: row => ({
			Combis: row.Combis,
			Following: row.Following,
			ComPlay: row.ComPlay,
			FollPlay: row.FollPlay,
			Pct: row.Pct,
			ComDrPlay: row.ComDrPlay,
			ID: row.ID
		})
	},	{
		title: 'Previous Sequential Combinations matching Current Patterns within 24 Last Draw Window',
		csv: '/csv/pwhzprjprv.csv',
		columns: [
			{ key: 'Combis', header: 'Combis', width: '10%', truncate: true },
			{ key: 'Foll', header: 'Foll', width: '10%', truncate: true },
			{ key: 'ID', header: 'ID', width: '5%' },
			{ key: 'DrNo', header: 'DrNo', width: '7%' },
			{ key: 'DrawDates', header: 'DrawDates', width: '12%', truncate: true },
			{ key: 'CurrPlayOrd', header: 'CurrPlayOrd', width: '12%', truncate: true },
			{ key: 'CPOIntervals', header: 'CPOIntervals', width: '12%', truncate: true },
			{ key: 'CPODays1', header: 'CPODays1', width: '10%' },
			{ key: 'LastDr', header: 'LastDr', width: '10%' },
			{ key: 'Info', header: 'Info', width: '12%', truncate: true }
		],
		sortBy: ['LastDr'],
		ascending: false,
		mapRow: row => ({
			Combis: row.Combis,
			Foll: row.Foll,
			ID: row.ID,
			DrNo: row.DrNo,
			DrawDates: row.DrawDates,
			CurrPlayOrd: row.CurrPlayOrd,
			CPOIntervals: row.CPOIntervals,
			CPODays1: row.CPODays1,
			LastDr: row.LastDr,
			Info: row.Info
		})
	}
];

const patternsMenuOptions = ['Table 001', 'Table 002', 'Table 003', 'Table 004'];

export function PredictionsTabContent() {
	const [selected, setSelected] = useState(0);
	const config = patternsConfig[selected];

	return (
		<>
			<Card className="p-6">
				<h3 className="text-xl font-semibold mb-6">{config.title}</h3>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
					{patternsMenuOptions.map((label, idx) => (
						<Button
							key={label}
							variant={selected === idx ? 'destructive' : 'outline'}
							className="w-full"
							onClick={() => setSelected(idx)}
						>
							{label}
						</Button>
					))}
				</div>
				<PlayWhePredictionTable config={config} />
			</Card>
			<div className="mt-8">
				<CommentSection />
			</div>
		</>
	);
}

package alpvax.rau.core;

import java.util.Arrays;

import alpvax.rau.core.Runes.Rune;

public class RuneString implements CharSequence
{
	private Rune[] runelist;

	public RuneString(Rune... runes)
	{
		runelist = runes;
	}
	public RuneString(String... runes)
	{
		runelist = new Rune[runes.length];
		for(int i = 0; i < runes.length; i++)
		{
			runelist[i] = Runes.runeMap.get(runes[i]);
		}
	}
	
	@Override
	public char charAt(int pos)
	{
		return runelist[pos].toChar();
	}

	@Override
	public int length()
	{
		return runelist.length;
	}

	@Override
	public CharSequence subSequence(int start, int end)
	{
		return new RuneString(Arrays.copyOfRange(runelist, start, end));
	}
	
	@Override
	public String toString()
	{
		StringBuilder s = new StringBuilder(length());
		for(Rune r : runelist)
		{
			s.append(r.toString());
		}
		return s.toString();
	}

}

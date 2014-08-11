package alpvax.rau.core;

import java.security.InvalidParameterException;
import java.util.HashMap;
import java.util.Map;

import alpvax.common.util.generics.StringMap;

public class Runes
{
	//***********************RUNE LIST***********************
	public static final Rune RAU = add(new Rune(262, "rau"));
	
	

	//***********************PROCESSING***********************
	private static final int FIRST_INDEX = 0xE000;
	private static final String PILLARED_NAME = "pillared_%s";
	
	public static Map<Integer, Rune> runeList;
	public static StringMap<Rune> runeMap;
	public static Map<String, Rune> runeNames;
	
	private static Rune add(Rune rune)
	{
		if(runeList == null)
		{
			runeList = new HashMap<Integer, Rune>();
			runeMap = new StringMap<Rune>();
			runeNames = new HashMap<String, Rune>();
		}
		Integer i = Integer.valueOf(rune.index);
		if(runeList.containsKey(i))
		{
			throw new InvalidParameterException(String.format("Unable to register Rune \"%1$s\". Rune \"%2$s\" already registered with index %3$d.", rune.name, runeList.get(i).name, i));
		}
		runeList.put(i, rune);
		runeMap.put(rune.toString(), rune);
		runeNames.put(rune.name, rune);
		if(rune.pillared == PillaredState.NORMAL)
		{
			add(new Rune(rune.index + 1, String.format(PILLARED_NAME, rune.name)).setPillared(PillaredState.PILLARED));
		}
		return rune;
	}

	public static class Rune
	{
		public final int index;
		public final String name;
		private PillaredState pillared = PillaredState.NONE;
		
		public Rune(int index, String name)
		{
			if(index < 0 || index >= 6400)
			{
				throw new InvalidParameterException("\"index\" must be between 0 and 6399 (inclusive). Recieved: " + index);
			}
			this.index = index;
			this.name = name;
		}
		
		public Rune setPillaredAllowed()
		{
			return setPillared(PillaredState.NORMAL);
		}
		private Rune setPillared(PillaredState state)
		{
			pillared = state;
			return this;
		}
		
		public boolean allowPillared()
		{
			return pillared != PillaredState.NONE;
		}
		public boolean isPillared()
		{
			return pillared == PillaredState.PILLARED;
		}
		
		public RuneSection getSection()
		{
			return RuneSection.get(index);
		}
		
		@Override
		public String toString()
		{
			return Character.toString(toChar());
		}
		
		public char toChar()
		{
			return (char)(FIRST_INDEX + index);
		}
		
		@Override
		public boolean equals(Object other)
		{
			return other != null ? other.toString().equals(toString()) : false;
		}
		
		@Override
		public int hashCode()
		{
			return toString().hashCode();
		}
	}
	
	private enum PillaredState
	{
		NONE, NORMAL, PILLARED;
	}
		
	public enum RuneSection
	{
		LETTERS(0),
		NUMBERS(50),
		PUNCTUATION(60),
		GRAMMAR(100),
		OTHER(200);
		/**
		 * Use this as opposed to the values() method to prevent the array being cloned each time.
		 * DO NOT MODIFY!
		 */
		public static final RuneSection[] values = values();
		
		private int start;
		private RuneSection(int hexStart)
		{
			start = Integer.parseInt(String.format("E%03d", hexStart), 16);
		}
		
		public static RuneSection get(int index)
		{
			RuneSection s = LETTERS;
			for(RuneSection r : values)
			{
				if(index < r.start)
				{
					return s;
				}
				s = r;
			}
			return OTHER;
		}
	}
}
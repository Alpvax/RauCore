package alpvax.rau.core.json;

import java.io.File;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

import alpvax.common.util.FileHelper;
import alpvax.common.util.generics.MapValueComparator;
import alpvax.rau.core.Runes;
import alpvax.rau.core.Runes.Rune;
import alpvax.rau.core.Runes.RuneSection;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public class Jsonifier
{
	public static class RuneSerializer implements JsonSerializer<Rune>
	{
		@Override
		public JsonElement serialize(Rune r, Type t, JsonSerializationContext c)
		{
			if(r.isPillared())
			{
				return null;
			}
			JsonObject o = new JsonObject();
			o.addProperty("type", r.getSection().name().toLowerCase());
			o.addProperty("pillared", r.allowPillared());
			o.addProperty("index", r.index);
			return o;
		}
	}
	public static class RuneSectionSerializer implements JsonSerializer<RuneSection>
	{
		@Override
		public JsonElement serialize(RuneSection r, Type t, JsonSerializationContext c)
		{
			JsonObject o = new JsonObject();
			o.addProperty("name", r.name().toLowerCase());
			JsonArray a = new JsonArray();
			for(int i = 0; i < 2; i++)
			{
				int j = r.getStart(i);
				a.add(new JsonPrimitive(Integer.valueOf(j) + " (" + Integer.toString(j, 16) + ")"));
			}
			o.add("start", a);
			return a;//o;
		}
	}

	public static void toJson(String file)
	{
		Map<String, Object> map = new HashMap<String, Object>();
		Map<String, RuneSection> m = new LinkedHashMap<String, RuneSection>();
		for(RuneSection r : RuneSection.values)
		{
			m.put(r.name().toLowerCase(), r);
		}
		map.put("Rune Types", m);
		//map.put("Rune Types", RuneSection.values);
		TreeMap<String, Rune> orderedRunes = new TreeMap<String, Rune>(MapValueComparator.get(Runes.runeNamesBase));
		orderedRunes.putAll(Runes.runeNamesBase);
		map.put("Basic Runes", orderedRunes);
		FileHelper.writeJsonFile(new File(file), map, new Object[]{Rune.class, new RuneSerializer()}, new Object[]{RuneSection.class, new RuneSectionSerializer()});
	}

	public static void main(String[] args)
	{
		String file = "setup_data.json";
		if(args.length >= 1)
		{
			file = args[0];
		}
		toJson(file);
	}
}
